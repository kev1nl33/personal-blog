#!/usr/bin/env python3
"""
网络诊断工具 - 检测家庭网络性能问题
支持 macOS/Linux 系统
"""

import subprocess
import platform
import json
import statistics
import socket
import time
from datetime import datetime
from typing import Dict, List, Tuple

class NetworkDiagnostics:
    def __init__(self):
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'system': platform.system(),
            'tests': {}
        }

    def run_command(self, command: str) -> Tuple[str, str, int]:
        """执行 shell 命令并返回结果"""
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

    def check_gateway(self) -> Dict:
        """检查默认网关连接状态"""
        print("🔍 检测网关连接...")

        # 获取默认网关
        if platform.system() == "Darwin":  # macOS
            gateway_cmd = "route -n get default | grep gateway | awk '{print $2}'"
        else:  # Linux
            gateway_cmd = "ip route | grep default | awk '{print $3}'"

        gateway, _, _ = self.run_command(gateway_cmd)

        if not gateway:
            return {'status': 'ERROR', 'message': '无法获取默认网关'}

        # Ping 网关
        ping_cmd = f"ping -c 10 -i 0.2 {gateway}"
        stdout, stderr, _ = self.run_command(ping_cmd)

        # 解析 ping 结果
        if not stdout:
            return {'status': 'ERROR', 'message': 'Ping 无响应'}

        lines = stdout.split('\n')
        avg_time = None
        packet_loss = "0%"
        min_time = None
        max_time = None

        for line in lines:
            # 检测丢包率
            if 'packet loss' in line or 'loss' in line.lower():
                parts = line.split()
                for i, part in enumerate(parts):
                    if '%' in part:
                        packet_loss = part.replace('%', '') + '%'

            # 检测延迟数据
            # macOS: min/avg/max/stddev = 1.234/5.678/9.012/1.234 ms
            # Linux: rtt min/avg/max/mdev = 1.234/5.678/9.012/1.234 ms
            if '=' in line and ('min' in line or 'round-trip' in line):
                try:
                    data_part = line.split('=')[1].strip()
                    # 移除 "ms" 单位
                    data_part = data_part.replace('ms', '').strip()
                    parts = data_part.split('/')
                    if len(parts) >= 4:
                        min_time = float(parts[0])
                        avg_time = float(parts[1])
                        max_time = float(parts[2])
                except Exception as e:
                    # 尝试从每行 ping 结果中提取
                    pass

            # 从单个 ping 结果提取时间 (macOS 格式: 64 bytes from ...: icmp_seq=0 ttl=64 time=1.234 ms)
            if 'time=' in line and avg_time is None:
                try:
                    time_part = line.split('time=')[1].split()[0]
                    return {
                        'status': 'PARTIAL',
                        'latency_ms': float(time_part),
                        'note': '单次采样',
                        'packet_loss': packet_loss
                    }
                except:
                    pass

        return {
            'status': 'OK',
            'gateway': gateway,
            'min_latency_ms': min_time,
            'avg_latency_ms': avg_time,
            'max_latency_ms': max_time,
            'packet_loss': packet_loss,
            'analysis': self._analyze_gateway_latency(avg_time, packet_loss) if avg_time else "⚠️ 无法解析延迟数据"
        }

    def _analyze_gateway_latency(self, latency: float, packet_loss: str) -> str:
        """分析网关延迟"""
        if latency is None:
            return "⚠️ 无法解析延迟数据"

        loss_val = float(packet_loss.replace('%', ''))

        if loss_val > 0:
            return f"🔴 丢包率 {packet_loss} - 网络不稳定"
        elif latency < 2:
            return f"🟢 优秀 ({latency:.2f}ms) - 有线连接正常"
        elif latency < 5:
            return f"🟡 良好 ({latency:.2f}ms) - 可能存在轻微延迟"
        else:
            return f"🔴 较高 ({latency:.2f}ms) - 检查 MESH 节点连接"

    def check_dns(self) -> Dict:
        """测试 DNS 解析速度"""
        print("🔍 测试 DNS 解析...")

        dns_servers = {
            '默认': None,  # 使用系统默认
            '阿里DNS': '223.5.5.5',
            '腾讯DNS': '119.29.29.29',
            'Cloudflare': '1.1.1.1',
            'Google': '8.8.8.8'
        }

        results = {}

        for name, server in dns_servers.items():
            times = []
            test_domain = "www.baidu.com"

            for _ in range(5):
                start = time.time()
                try:
                    if server:
                        socket.setdefaulttimeout(2)
                        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((server, 53))
                    resolver = socket.getaddrinfo(test_domain, 80)
                    elapsed = (time.time() - start) * 1000
                    times.append(elapsed)
                except:
                    times.append(2000)  # 超时

            avg_time = statistics.mean(times) if times else 0
            results[name] = {
                'avg_ms': round(avg_time, 2),
                'server': server or '系统默认'
            }

        # 找出最快的 DNS
        fastest = min(results.items(), key=lambda x: x[1]['avg_ms'])

        return {
            'status': 'OK',
            'results': results,
            'recommendation': f"推荐使用 {fastest[0]} ({fastest[1]['server']})"
        }

    def check_internet_latency(self) -> Dict:
        """测试到互联网的延迟"""
        print("🔍 测试互联网连接...")

        targets = {
            '百度': 'www.baidu.com',
            '阿里': 'www.aliyun.com',
            'Cloudflare': '1.1.1.1'
        }

        results = {}

        for name, target in targets.items():
            ping_cmd = f"ping -c 10 -i 0.2 {target}"
            stdout, stderr, _ = self.run_command(ping_cmd)

            if not stderr:
                lines = stdout.split('\n')
                for line in lines:
                    if 'min/avg/max' in line or 'round-trip' in line:
                        try:
                            parts = line.split('=')[1].strip().split('/')
                            results[name] = {
                                'min_ms': float(parts[0]),
                                'avg_ms': float(parts[1]),
                                'max_ms': float(parts[2]),
                                'jitter_ms': float(parts[3]) if len(parts) > 3 else None
                            }
                            break
                        except:
                            results[name] = {'error': '解析失败'}

        # 计算平均延迟
        avg_latencies = [r['avg_ms'] for r in results.values() if isinstance(r, dict) and 'avg_ms' in r]
        overall_avg = statistics.mean(avg_latencies) if avg_latencies else None

        return {
            'status': 'OK',
            'results': results,
            'overall_avg_ms': overall_avg,
            'analysis': self._analyze_internet_latency(overall_avg)
        }

    def _analyze_internet_latency(self, latency: float) -> str:
        """分析互联网延迟"""
        if latency is None:
            return "⚠️ 无法测量"

        if latency < 20:
            return f"🟢 优秀 ({latency:.2f}ms)"
        elif latency < 50:
            return f"🟡 良好 ({latency:.2f}ms)"
        elif latency < 100:
            return f"🟠 一般 ({latency:.2f}ms) - 高峰期正常"
        else:
            return f"🔴 较高 ({latency:.2f}ms) - 建议检查带宽或联系运营商"

    def check_bandwidth(self) -> Dict:
        """测试带宽（需要安装 speedtest-cli）"""
        print("🔍 测试带宽...")

        # 检查是否安装 speedtest-cli
        check_cmd = "which speedtest-cli || which speedtest"
        stdout, _, returncode = self.run_command(check_cmd)

        if returncode != 0:
            return {
                'status': 'SKIP',
                'message': '未安装 speedtest-cli，请运行: pip install speedtest-cli'
            }

        print("   带宽测试需要约30秒，请稍候...")
        speedtest_cmd = "speedtest --simple --secure"
        stdout, stderr, _ = self.run_command(speedtest_cmd)

        if stderr:
            return {'status': 'ERROR', 'message': stderr}

        # 解析结果
        lines = stdout.split('\n')
        results = {}
        for line in lines:
            if 'Ping' in line:
                results['ping'] = line.split(':')[1].strip()
            elif 'Download' in line:
                results['download'] = line.split(':')[1].strip()
            elif 'Upload' in line:
                results['upload'] = line.split(':')[1].strip()

        return {
            'status': 'OK',
            'results': results
        }

    def check_mesh_nodes(self) -> Dict:
        """检测本地网络中的 MESH 节点"""
        print("🔍 扫描 MESH 节点...")

        # 尝试常见的 ASUS 路由器 IP
        common_ips = ['192.168.1.1', '192.168.0.1', '192.168.50.1']

        # 扫描本地网段
        gateway, _, _ = self.run_command("route -n get default | grep gateway | awk '{print $2}'")

        if not gateway:
            return {'status': 'ERROR', 'message': '无法获取网关'}

        # 扫描网段
        network = '.'.join(gateway.split('.')[:3]) + '.0/24'

        # 使用 nmap 或 arp-scan（如果可用）
        scan_cmd = f"arp -a | grep -v incomplete"
        stdout, _, _ = self.run_command(scan_cmd)

        devices = []
        for line in stdout.split('\n'):
            if 'asus' in line.lower() or 'router' in line.lower():
                parts = line.split()
                if len(parts) > 1:
                    ip = parts[1].strip('()')
                    devices.append({'ip': ip, 'type': '可能的MESH节点'})

        # 检查路由器管理页面
        for ip in common_ips:
            ping_cmd = f"ping -c 1 -W 1000 {ip}"
            stdout, stderr, _ = self.run_command(ping_cmd)
            if not stderr and 'time=' in stdout:
                if ip not in [d['ip'] for d in devices]:
                    devices.append({'ip': ip, 'type': '网关/主路由'})

        return {
            'status': 'OK',
            'gateway': gateway,
            'devices_found': devices,
            'count': len(devices)
        }

    def check_router_web_interface(self) -> Dict:
        """尝试获取路由器信息"""
        print("🔍 检测路由器管理界面...")

        gateway, _, _ = self.run_command("route -n get default | grep gateway | awk '{print $2}'")

        if not gateway:
            return {'status': 'ERROR', 'message': '无法获取网关地址'}

        return {
            'status': 'OK',
            'message': f'路由器管理界面: http://{gateway}\n建议检查: QoS设置、MESH状态、带宽分配',
            'gateway_url': f'http://{gateway}'
        }

    def run_all_tests(self) -> Dict:
        """运行所有诊断测试"""
        print("=" * 50)
        print("🚀 开始网络诊断...")
        print("=" * 50)

        tests = [
            ('网关连接', self.check_gateway),
            ('MESH节点', self.check_mesh_nodes),
            ('DNS解析', self.check_dns),
            ('互联网延迟', self.check_internet_latency),
            ('路由器管理界面', self.check_router_web_interface),
            ('带宽测试', self.check_bandwidth),
        ]

        for test_name, test_func in tests:
            print()
            try:
                self.results['tests'][test_name] = test_func()
            except Exception as e:
                self.results['tests'][test_name] = {
                    'status': 'ERROR',
                    'message': str(e)
                }

        return self.results

    def print_report(self):
        """打印诊断报告"""
        print()
        print("=" * 50)
        print("📊 诊断报告")
        print("=" * 50)
        print(f"时间: {self.results['timestamp']}")
        print()

        # 优先显示问题
        problems = []

        for test_name, result in self.results['tests'].items():
            if result.get('status') == 'ERROR':
                problems.append(f"❌ {test_name}: {result.get('message', '测试失败')}")
            elif 'analysis' in result and '🔴' in result['analysis']:
                problems.append(f"⚠️ {test_name}: {result['analysis']}")

        if problems:
            print("🚨 发现的问题:")
            for problem in problems:
                print(f"  {problem}")
            print()

        # 显示详细结果
        for test_name, result in self.results['tests'].items():
            print(f"--- {test_name} ---")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            print()

        # 给出建议
        self._print_recommendations()

    def _print_recommendations(self):
        """打印优化建议"""
        print("=" * 50)
        print("💡 优化建议")
        print("=" * 50)

        gateway_result = self.results['tests'].get('网关连接', {})
        dns_result = self.results['tests'].get('DNS解析', {})
        internet_result = self.results['tests'].get('互联网延迟', {})

        # 基于测试结果给出建议
        gateway_latency = gateway_result.get('avg_latency_ms')
        if gateway_latency is not None and gateway_latency > 5:
            print("1. 网关延迟较高，建议:")
            print("   - 检查 MESH 节点是否使用有线回程")
            print("   - 尝试将设备连接到主路由测试")
            print()

        if 'recommendation' in dns_result:
            print("2. DNS 优化:")
            print(f"   - {dns_result['recommendation']}")
            print("   - 在路由器设置中更改 DNS 服务器")
            print()

        internet_latency = internet_result.get('overall_avg_ms')
        if internet_latency is not None and internet_latency > 50:
            print("3. 互联网延迟较高，建议:")
            print("   - 检查是否有大量下载占用带宽")
            print("   - 启用路由器的 QoS 功能")
            print("   - 考虑在非高峰期进行大流量活动")
            print()

        print("4. 通用优化:")
        print("   - 定期重启路由器（每周一次）")
        print("   - 更新路由器固件到最新版本")
        print("   - 检查是否可升级到更高带宽套餐")
        print("=" * 50)


def main():
    diagnostics = NetworkDiagnostics()

    try:
        results = diagnostics.run_all_tests()
        diagnostics.print_report()

        # 保存结果到文件
        with open('network_diagnostic_report.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"\n✅ 完整报告已保存到: network_diagnostic_report.json")

    except KeyboardInterrupt:
        print("\n\n⚠️ 诊断被用户中断")
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")


if __name__ == "__main__":
    main()
