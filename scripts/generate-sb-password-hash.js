#!/usr/bin/env node
// 生成第二大脑登录密码的加盐哈希 —— 输出粘贴到环境变量 SB_PASSWORD_HASH
//
// 用法（交互式输入，密码不回显、不写入任何文件）：
//   node scripts/generate-sb-password-hash.js
//   node scripts/generate-sb-password-hash.js --iterations 200000   // 自定义迭代次数
//
// 输出格式：pbkdf2:<迭代次数>:<盐hex>:<哈希hex>
//   - 算法：PBKDF2-HMAC-SHA256，输出 256 位哈希
//   - 盐：16 字级密码学随机数，与哈希一起编码在同一个字符串里（存放在
//     SB_PASSWORD_HASH 环境变量中），无需单独的盐存储
//   - 校验端 functions/second-brain/_lib/auth.mjs 按同一格式重算并常数时间比对
//
// 配置位置：
//   - 线上：Cloudflare Pages 项目 → Settings → Environment variables → SB_PASSWORD_HASH
//   - 本地：项目根目录 .dev.vars（已被 .gitignore 排除，绝不能提交）
//
// 迭代次数默认 100000。若 Pages 免费版登录请求触发 CPU 时间超限，
// 可调低（如 50000）后重新生成并更新环境变量。

const crypto = require('node:crypto');

function parseIterations() {
    const idx = process.argv.indexOf('--iterations');
    if (idx === -1) return 100000;
    const value = Number(process.argv[idx + 1]);
    if (!Number.isInteger(value) || value < 1 || value > 5000000) {
        console.error('❌ --iterations 需要一个 1 到 5000000 之间的整数');
        process.exit(1);
    }
    return value;
}

// 隐藏输入：TTY 裸模式下终端不回显；Ctrl+C 直接退出
function askHidden(prompt) {
    return new Promise((resolve) => {
        process.stdout.write(prompt);
        const stdin = process.stdin;
        const isTTY = typeof stdin.isTTY === 'boolean' ? stdin.isTTY : false;
        if (isTTY) stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        let input = '';
        const onData = (ch) => {
            if (ch === '\r' || ch === '\n') {
                stdin.removeListener('data', onData);
                if (isTTY) stdin.setRawMode(false);
                stdin.pause();
                process.stdout.write('\n');
                resolve(input);
            } else if (ch === '\u0003') {
                process.exit(130);
            } else if (ch === '\u007f' || ch === '\b') {
                input = input.slice(0, -1);
            } else {
                input += ch;
            }
        };
        stdin.on('data', onData);
    });
}

(async () => {
    const iterations = parseIterations();
    const password = await askHidden('输入新密码: ');
    const confirmed = await askHidden('再输一遍确认: ');

    if (password.length < 8) {
        console.error('❌ 密码至少需要 8 个字符');
        process.exit(1);
    }
    if (password !== confirmed) {
        console.error('❌ 两次输入不一致');
        process.exit(1);
    }

    const salt = crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');

    console.log('\n把下面这一行配置为 SB_PASSWORD_HASH：\n');
    console.log(`SB_PASSWORD_HASH=pbkdf2:${iterations}:${salt.toString('hex')}:${hash.toString('hex')}`);
    console.log('\n（密码本身已用完即弃，本脚本不保存任何内容）');
})();
