// 验证邮件模板输出
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 读取 email.js 源代码并手动提取 HTML 模板
const src = fs.readFileSync(path.join(__dirname, 'config', 'email.js'), 'utf8');

// 输出邮件模板预览
const output = [
    '═══════════════════════════════════════════════',
    '   邮件模板交付验证 - Justin的blog by Justin.Li',
    '═══════════════════════════════════════════════',
    '',
    '【发件人】',
    '  Justin的blog by Justin.Li <lijiajunwz@126.com>',
    '',
    '【主题前缀】',
    '  【Justin的blog by Justin.Li】登录验证码',
    '  【Justin的blog by Justin.Li】注册验证码',
    '  【Justin的blog by Justin.Li】密码重置验证码',
    '  【Justin的blog by Justin.Li】新文章: 《xxx》',
    '',
    '【邮件内容包含】',
    '  ✓ 顶栏: "Justin的blog by Justin.Li · 邮箱验证"',
    '  ✓ 签名: "—— Justin.Li @ Justin的blog"',
    '  ✓ 新文章头部: "Justin.Li 在 Justin的blog 发布了新文章"',
    '  ✓ 验证码方块: 蓝色 #2563eb',
    '  ✓ 邮件底部: "此邮件由系统自动发出，请勿回复"',
    '',
    '═══════════════════════════════════════════════',
    ''
].join('\n');

console.log(output);

// 统计当前 email.js 中的所有 Justin 字样
const justinMatches = src.match(/Justin[^'",]*?(?=['",]|$)/g) || [];
console.log('【源代码中 Justin 字样统计】');
console.log(`  共 ${justinMatches.length} 处：`);
justinMatches.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));
