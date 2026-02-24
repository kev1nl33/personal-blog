#!/usr/bin/env python3
"""
API 域名网络诊断工具
测试 api.z.ai:443 在不同网络环境下的连接性能
"""

import subprocess
import socket
import time
import json
from datetime import datetime
from typing import Dict, List, Tuple

class APIDomainDiagnostics:
    def __init__(self, domain: str, port: int = 443):
        self.domain = domain
        self.port = port
        self.results = {
            'domain': domain,
            'port': port,
            'timestamp': datetime.now().isoformat(),
            'tests': {}
        }

    def run_command(self, command: str) -> Tuple[str, str, int]:
        """执行 shell 命令"""
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.stdout.strip(), result.stderr.strip(), result.returncode
        except subprocess.TimeoutExpired:
            return "", "命令超时", -1
        except Exception as e:
            return "", str(e), -1

    def resolve_dns(self) -> Dict:
        """DNS 解析测试"""
        print(f"🔍 解析 {self.domain} 的 DNS...")

        dns_servers = {
            '系统默认': None,
            '阿里DNS': '223.5.5.5',
            '腾讯DNS': '119.29.29.29',
            'Cloudflare': '1.1.1.1',
            'Google': '8.8.8.8'
        }

        results = {}

        for name, server in dns_servers.items():
            try:
                start = time.time()
                if server:
                    # 使用指定 DNS 服务器
                    cmd = f"nslookup {self.domain} {server}"
                else:
                    cmd = f"nslookup {self.domain}"

                stdout, _, _ = self.run_command(cmd)
                elapsed = (time.time() - start) * 1000

                # 解析 IP 地址
                ip = None
                for line in stdout.split('\n'):
                    if 'Address:' in line and '##' not in line and '#' not in line.split('Address:')[1]:
                        ip = line.split('Address:')[1].strip()
                        break
                    elif 'Addresses:' in line:
                        addrs = line.split('Addresses:')[1].strip().split()
                        if addrs:
                            ip = addrs[0]
                            break

                results[name] = {
                    'ip': ip,
                    'resolve_time_ms': round(elapsed, 2),
                    'server': server or '系统默认'
                }
            except Exception as e:
                results[name] = {'error': str(e)}

        # 找出最快的 DNS 和所有解析的 IP
        valid_results = {k: v for k, v in results.items() if 'ip' in v and v['ip']}
        ips = list(set([r['ip'] for r in valid_results.values()]))

        return {
            'status': 'OK' if valid_results else 'ERROR',
            'results': results,
            'resolved_ips': ips,
            'fastest_dns': min(valid_results.items(), key=lambda x: x[1]['resolve_time_ms'])[0] if valid_results else None
        }

    def test_tcp_connect(self, ip: str) -> Dict:
        """测试 TCP 连接延迟"""
        latencies = []
        success_count = 0

        for i in range(10):
            try:
                start = time.time()
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(5)
                sock.connect((ip, self.port))
                sock.close()
                elapsed = (time.time() - start) * 1000
                latencies.append(elapsed)
                success_count += 1
            except socket.timeout:
                latencies.append(5000)
            except Exception as e:
                latencies.append(5000)

        latencies.sort()
        successful = [l for l in latencies if l < 5000]

        if not successful:
            return {'status': 'ERROR', 'message': '无法连接'}

        return {
            'status': 'OK',
            'success_rate': f"{success_count}/10",
            'min_ms': round(successful[0], 2),
            'avg_ms': round(sum(successful) / len(successful), 2),
            'max_ms': round(successful[-1], 2),
            'jitter_ms': round(statistics_std(successful) if len(successful) > 1 else 0, 2)
        }

    def trace_route(self, target: str) -> Dict:
        """路由追踪"""
        print(f"🔍 追踪到 {target} 的路由路径...")

        cmd = f"traceroute -n -m 15 -q 1 {target}"
        stdout, stderr, _ = self.run_command(cmd)

        if stderr and "Command not found" in stderr:
            # macOS 使用 traceroute，Linux 可能需要
            cmd = f"tracepath -n {target}"
            stdout, stderr, _ = self.run_command(cmd)

        hops = []
        for line in stdout.split('\n'):
            if line.strip() and line[0].isdigit():
                parts = line.split()
                if len(parts) >= 2:
                    hop_num = parts[0]
                    ip = parts[1] if parts[1] != '*' else '超时'
                    hops.append({'hop': hop_num, 'ip': ip})

        # 分析路由特点
        china_telecom = any('202.97' in h.get('ip', '') or '218.205' in h.get('ip', '') or '220.181' in h.get('ip', '') for h in hops)
        china_unicom = any('218.105' in h.get('ip', '') or '221.176' in h.get('ip', '') or '123.125' in h.get('ip', '') for h in hops)
        china_mobile = any('211.136' in h.get('ip', '') or '221.179' in h.get('ip', '') for h in hops)
        international = any(h.get('ip', '').startswith('8.') or h.get('ip', '').startswith('1.') or h.get('ip', '').startswith('104.') or h.get('ip', '').startswith('172.') for h in hops)

        network_type = []
        if china_telecom: network_type.append('电信')
        if china_unicom: network_type.append('联通')
        if china_mobile: network_type.append('移动')
        if international: network_type.append('国际出口')

        return {
            'status': 'OK',
            'hops_count': len(hops),
            'network_type': network_type if network_type else ['未知'],
            'first_hops': hops[:5]
        }

    def ping_test(self, target: str) -> Dict:
        """Ping 测试"""
        cmd = f"ping -c 20 -i 0.2 {target}"
        stdout, stderr, _ = self.run_command(cmd)

        if not stdout:
            return {'status': 'ERROR', 'message': 'Ping 无响应'}

        # 解析结果
        lines = stdout.split('\n')
        packet_loss = "100%"
        avg_time = None

        for line in lines:
            if 'packet loss' in line or 'loss' in line.lower():
                parts = line.split()
                for i, part in enumerate(parts):
                    if '%' in part:
                        packet_loss = part.replace('%', '') + '%'

            if '=' in line and ('min' in line or 'round-trip' in line):
                try:
                    data_part = line.split('=')[1].strip().replace('ms', '').strip()
                    parts = data_part.split('/')
                    if len(parts) >= 3:
                        avg_time = float(parts[1])
                except:
                    pass

        return {
            'status': 'OK',
            'avg_latency_ms': avg_time,
            'packet_loss': packet_loss
        }

    def check_server_location(self, ip: str) -> Dict:
        """推断服务器位置"""
        # 使用 whois 查询 IP 归属地
        cmd = f"whois {ip} | grep -i 'country\\|netname'"
        stdout, _, _ = self.run_command(cmd)

        country = '未知'
        isp = '未知'

        for line in stdout.split('\n'):
            line = line.strip()
            if 'country' in line.lower():
                parts = line.split(':')
                if len(parts) > 1:
                    country = parts[1].strip().upper()
            if 'netname' in line.lower():
                parts = line.split(':')
                if len(parts) > 1:
                    isp = parts[1].strip()

        return {
            'ip': ip,
            'country': country,
            'isp': isp
        }

    def run_diagnostics(self) -> Dict:
        """运行完整诊断"""
        print("=" * 60)
        print(f"🚀 开始诊断 {self.domain}:{self.port}")
        print("=" * 60)
        print()

        # 1. DNS 解析
        dns_result = self.resolve_dns()
        self.results['tests']['dns'] = dns_result

        if dns_result['status'] != 'OK' or not dns_result['resolved_ips']:
            print("❌ DNS 解析失败，无法继续")
            return self.results

        primary_ip = dns_result['resolved_ips'][0]
        print(f"✅ DNS 解析成功: {primary_ip}")
        print(f"   最快 DNS: {dns_result['fastest_dns']}")
        print()

        # 2. 服务器位置推断
        print("🔍 推断服务器位置...")
        location = self.check_server_location(primary_ip)
        self.results['tests']['server_location'] = location
        print(f"   IP: {location['ip']}")
        print(f"   国家/地区: {location['country']}")
        print(f"   ISP: {location['isp']}")
        print()

        # 3. TCP 连接测试
        print("🔍 测试 TCP 连接延迟...")
        tcp_result = self.test_tcp_connect(primary_ip)
        self.results['tests']['tcp_connection'] = tcp_result
        if tcp_result['status'] == 'OK':
            print(f"   平均延迟: {tcp_result['avg_ms']}ms")
            print(f"   最小延迟: {tcp_result['min_ms']}ms")
            print(f"   成功率: {tcp_result['success_rate']}")
        print()

        # 4. Ping 测试
        print("🔍 执行 Ping 测试...")
        ping_result = self.ping_test(primary_ip)
        self.results['tests']['ping'] = ping_result
        if ping_result['status'] == 'OK':
            print(f"   平均延迟: {ping_result['avg_latency_ms']}ms")
            print(f"   丢包率: {ping_result['packet_loss']}")
        print()

        # 5. 路由追踪
        print("🔍 追踪路由路径...")
        route_result = self.trace_route(primary_ip)
        self.results['tests']['route_trace'] = route_result
        print(f"   跳数: {route_result['hops_count']}")
        print(f"   网络类型: {', '.join(route_result['network_type'])}")
        print()

        # 6. 生成建议
        self.results['recommendation'] = self._generate_recommendation()

        return self.results

    def _generate_recommendation(self) -> Dict:
        """生成连接建议"""
        tcp = self.results['tests'].get('tcp_connection', {})
        ping = self.results['tests'].get('ping', {})
        route = self.results['tests'].get('route_trace', {})
        location = self.results['tests'].get('server_location', {})

        latency = tcp.get('avg_ms') or ping.get('avg_latency_ms')
        packet_loss = ping.get('packet_loss', '0%').replace('%', '')
        network_types = route.get('network_type', [])
        server_country = location.get('country', '未知')

        recommendation = {
            'connection_method': '直连',
            'reason': [],
            'latency_level': '未知'
        }

        # 延迟评估
        if latency:
            if latency < 30:
                recommendation['latency_level'] = '优秀'
                recommendation['reason'].append(f'延迟极低 ({latency}ms)，直连表现优异')
            elif latency < 80:
                recommendation['latency_level'] = '良好'
                recommendation['reason'].append(f'延迟正常 ({latency}ms)，直连可以接受')
            elif latency < 150:
                recommendation['latency_level'] = '一般'
                recommendation['reason'].append(f'延迟偏高 ({latency}ms)')

                # 服务器在海外
                if server_country not in ['CN', '未知']:
                    recommendation['connection_method'] = 'VPN/代理'
                    recommendation['reason'].append(f'服务器位于 {server_country}，使用海外 VPN 可能更快')
            else:
                recommendation['latency_level'] = '较差'
                recommendation['reason'].append(f'延迟很高 ({latency}ms)')

                if server_country not in ['CN', '未知']:
                    recommendation['connection_method'] = 'VPN/代理'
                    recommendation['reason'].append(f'服务器位于 {server_country}，强烈建议使用 VPN')
                else:
                    recommendation['reason'].append('服务器在国内但延迟很高，可能是网络拥堵')

        # 丢包率评估
        if float(packet_loss) > 5:
            recommendation['reason'].append(f'丢包率较高 ({packet_loss}%)，VPN 可能改善稳定性')
        elif float(packet_loss) > 1:
            recommendation['reason'].append(f'存在轻微丢包 ({packet_loss}%)')

        # 网络类型分析
        if '国际出口' in network_types and recommendation['connection_method'] == '直连':
            recommendation['connection_method'] = 'VPN/代理'
            recommendation['reason'].append('检测到国际出口路由，使用 VPN 可能绕过拥堵')

        return recommendation

    def print_report(self):
        """打印诊断报告"""
        print()
        print("=" * 60)
        print("📊 诊断报告")
        print("=" * 60)
        print()

        # 核心结果
        tcp = self.results['tests'].get('tcp_connection', {})
        ping = self.results['tests'].get('ping', {})
        location = self.results['tests'].get('server_location', {})
        rec = self.results.get('recommendation', {})

        latency = tcp.get('avg_ms') or ping.get('avg_latency_ms')

        print(f"🌐 服务器信息:")
        print(f"   IP: {location.get('ip', 'N/A')}")
        print(f"   位置: {location.get('country', 'N/A')}")
        print(f"   ISP: {location.get('isp', 'N/A')}")
        print()

        print(f"📈 连接性能:")
        print(f"   平均延迟: {latency}ms" if latency else "   平均延迟: N/A")
        print(f"   丢包率: {ping.get('packet_loss', 'N/A')}")
        print()

        print(f"💡 连接建议:")
        print(f"   推荐方式: {rec.get('connection_method', 'N/A')}")
        print(f"   延迟评级: {rec.get('latency_level', 'N/A')}")
        print(f"   原因:")
        for reason in rec.get('reason', []):
            print(f"     • {reason}")
        print()

        # 详细测试结果
        print("=" * 60)
        print("📄 详细测试结果")
        print("=" * 60)

        for test_name, result in self.results['tests'].items():
            print()
            print(f"【{test_name}】")
            print(json.dumps(result, indent=2, ensure_ascii=False))


def statistics_std(data: List[float]) -> float:
    """计算标准差"""
    if len(data) < 2:
        return 0
    mean = sum(data) / len(data)
    variance = sum((x - mean) ** 2 for x in data) / (len(data) - 1)
    return variance ** 0.5


def main():
    domain = "api.z.ai"
    port = 443

    diagnostics = APIDomainDiagnostics(domain, port)

    try:
        results = diagnostics.run_diagnostics()
        diagnostics.print_report()

        # 保存结果
        output_file = 'api_domain_diagnostic_report.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print()
        print("=" * 60)
        print(f"✅ 报告已保存: {output_file}")
        print("=" * 60)

    except KeyboardInterrupt:
        print("\n\n⚠️ 诊断被用户中断")
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
