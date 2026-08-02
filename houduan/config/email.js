const nodemailer = require('nodemailer');
require('dotenv').config();

const port = parseInt(process.env.EMAIL_PORT || '465');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: port === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const fromName = process.env.EMAIL_FROM_NAME || 'Justin的blog by Justin.Li';

// ============================================
// 验证码邮件（沿用你给的模板）
// ============================================
function codeDigit(ch) {
    return '<span style="display:inline-block;color:#2563eb;width:60px;height:60px;line-height:60px;text-align:center;font-size:36px;font-weight:bold;background-color:#e0ecff;border:1px solid #93c5fd;border-radius:8px;margin:0 4px;">' + ch + '</span>';
}

function buildCodeMailHtml(title, code) {
    const codeHtml = code.split('').map(codeDigit).join('');

    return [
        '<!DOCTYPE html>',
        '<html lang="zh-CN">',
        '<head><meta charset="UTF-8"><title>邮箱验证码</title></head>',
        '<body style="margin:0;padding:0;background-color:#f5f5f7;font-family:Tahoma,Arial,宋体,sans-serif;">',
        '<table cellpadding="0" cellspacing="0" border="0" width="700" align="center" style="width:700px;margin:0 auto;background-color:#ffffff;font-family:Tahoma,Arial,宋体,sans-serif;">',
        '<tbody>',
        '<tr>',
        '<td>',
        '<table cellpadding="0" cellspacing="0" border="0" width="700" style="width:700px;border-bottom:1px solid #cccccc;margin:0 auto 30px;font:12px Tahoma,Arial,宋体;height:40px;">',
        '<tbody><tr><td style="padding:10px 10px 0;color:#747474;">Justin的blog by Justin.Li · 邮箱验证</td></tr></tbody>',
        '</table>',
        '<div style="width:680px;padding:0 10px;margin:0 auto;">',
        '<div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">',
        '<strong style="display:block;margin-bottom:15px;">尊敬的用户，您好！</strong>',
        '<strong style="display:block;margin-bottom:15px;">您正在进行<span style="color:#2563eb;font-size:18px;">' + title + '</span>操作，请在验证码中输入以下验证码完成操作：</strong>',
        '<div style="height:auto;width:680px;text-align:center;margin:30px 0;">',
        codeHtml,
        '</div>',
        '</div>',
        '<div style="margin-bottom:30px;">',
        '<small style="display:block;margin-bottom:20px;font-size:12px;color:#747474;">',
        '注意：此操作可能会修改您的密码、登录邮箱或绑定手机。如非本人操作，请及时登录并修改密码以保证帐户安全',
        '<br>（工作人员不会向你索取此验证码，请勿泄漏！）',
        '</small>',
        '</div>',
        '</div>',
        '<div style="width:700px;margin:0 auto;">',
        '<div style="padding:10px 10px 0;border-top:1px solid #cccccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">',
        '<p style="margin:0;">此为系统邮件，请勿回复<br>请保管好您的邮箱，避免账号被他人盗用</p>',
        '<p style="margin:10px 0 0;text-align:right;font-size:18px;color:#2563eb;font-weight:bold;">—— Justin.Li @ Justin的blog</p>',
        '</div>',
        '</div>',
        '</td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</body>',
        '</html>'
    ].join('\n');
}

// ============================================
// 新文章通知邮件（套用 Apple Receipt 模板风格）
// ============================================
function buildArticleMailHtml(article) {
    const title = article.title || '新文章';
    const author = article.author_name || 'Justin.Li';
    const date = new Date(article.published_at || new Date()).toLocaleString('zh-CN', { hour12: false });
    const summary = (article.summary || '').replace(/<[^>]+>/g, '').substring(0, 200) || '点击下方链接查看完整内容';
    const url = (article.blog_url || 'http://localhost:5173') + '/article/' + (article.id || '');
    const unsubscribeUrl = (article.blog_url || 'http://localhost:5173') + '/unsubscribe?email=' + encodeURIComponent(article._to || '');
    const category = article.category_name || '未分类';

    return [
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
        '<html dir="ltr" lang="zh-CN">',
        '<head>',
        '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
        '<meta name="x-apple-disable-message-reformatting" />',
        '<title>新文章通知</title>',
        '</head>',
        '<body dir="ltr" lang="zh-CN" style="background-color:rgb(245,245,247);margin:0;padding:0;">',

        // 外层容器
        '<table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">',
        '<tbody>',
        '<tr>',
        '<td dir="ltr" lang="zh-CN" style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Helvetica,Arial,sans-serif;background-color:rgb(245,245,247);">',

        // 预隐藏文本
        '<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">',
        'Justin.Li 在 Justin的blog 发布了新文章《' + title + '》',
        '</div>',

        // 主容器 660px
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:100%;margin:0 auto;width:660px;">',
        '<tbody>',
        '<tr style="width:100%">',
        '<td style="padding:0;padding-top:20px;padding-bottom:48px;">',

        // 顶部 Logo + 标题
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tbody>',
        '<tr><td>',
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tbody style="width:100%"><tr style="width:100%">',
        '<td data-id="__react-email-column">',
        '<img alt="Justin的blog" height="42" width="42" src="http://localhost:5173/logo.png" style="display:block;outline:none;border:none;text-decoration:none;border-radius:50%;" />',
        '</td>',
        '<td align="right" data-id="__react-email-column" style="display:table-cell">',
        '<p style="font-size:32px;line-height:24px;font-weight:300;color:rgb(136,136,136);margin:16px 0;">新文章</p>',
        '</td>',
        '</tr></tbody>',
        '</table>',
        '</td></tr>',
        '</tbody>',
        '</table>',

        // 欢迎语
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tbody><tr><td>',
        '<p style="font-size:14px;line-height:24px;text-align:center;margin:36px 0 40px 0;font-weight:500;color:rgb(17,17,17);">',
        'Justin.Li 在 <strong>Justin的blog</strong> 发布了新文章。',
        '<a href="' + url + '" style="color:#067df7;text-decoration:none;">立即查看</a>',
        '</p>',
        '</td></tr></tbody>',
        '</table>',

        // 信息卡（双栏）
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0;color:rgb(51,51,51);background-color:rgb(250,250,250);border-radius:3px;font-size:12px;">',
        '<tbody><tr><td>',
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tbody style="width:100%"><tr style="width:100%">',
        // 左栏
        '<td style="width:60%;">',
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>',
        '<p style="font-size:10px;line-height:1.4;margin:0;padding:20px 20px 4px 20px;color:rgb(102,102,102);">作 者</p>',
        '<p style="font-size:12px;line-height:1.4;margin:0;padding:0 20px 16px 20px;">' + author + '</p>',
        '</td></tr></tbody></table>',
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>',
        '<p style="font-size:10px;line-height:1.4;margin:0;padding:0 20px 4px 20px;color:rgb(102,102,102);">分 类</p>',
        '<p style="font-size:12px;line-height:1.4;margin:0;padding:0 20px 16px 20px;">' + category + '</p>',
        '</td></tr></tbody></table>',
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>',
        '<p style="font-size:10px;line-height:1.4;margin:0;padding:0 20px 4px 20px;color:rgb(102,102,102);">发布时间</p>',
        '<p style="font-size:12px;line-height:1.4;margin:0;padding:0 20px 16px 20px;">' + date + '</p>',
        '</td></tr></tbody></table>',
        '</td>',
        // 右栏
        '<td style="width:40%;padding-left:20px;border-left:1px solid rgb(238,238,238);">',
        '<p style="font-size:10px;line-height:1.4;margin:0;padding:20px 20px 4px 20px;color:rgb(102,102,102);">文章链接</p>',
        '<a href="' + url + '" style="display:block;font-size:12px;line-height:1.4;margin:0;padding:0 20px 16px 20px;color:rgb(0,112,201);text-decoration:underline;word-break:break-all;">' + url + '</a>',
        '</td>',
        '</tr></tbody>',
        '</table>',
        '</td></tr></tbody>',
        '</table>',

        // 章节标题
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;color:rgb(51,51,51);background-color:rgb(250,250,250);border-radius:3px;font-size:12px;margin-top:30px;margin-bottom:15px;">',
        '<tbody><tr><td>',
        '<p style="font-size:14px;line-height:24px;background-color:rgb(250,250,250);padding:10px 10px 10px 10px;font-weight:500;margin:0;">' + title + '</p>',
        '</td></tr></tbody>',
        '</table>',

        // 文章摘要
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tbody><tr><td style="padding:20px 0;">',
        '<p style="font-size:14px;line-height:24px;color:rgb(51,51,51);margin:0;padding:0 20px;">' + summary + '</p>',
        '<p style="margin:24px 0 0 20px;text-align:left;">',
        '<a href="' + url + '" style="display:inline-block;padding:12px 30px;background-color:rgb(0,112,201);color:rgb(255,255,255);text-decoration:none;border-radius:4px;font-size:14px;">立即阅读</a>',
        '</p>',
        '</td></tr></tbody>',
        '</table>',

        // 分隔线
        '<hr style="width:100%;border:none;border-color:transparent;border-top:1px solid #eaeaea;margin-top:30px;margin-bottom:0;" />',

        // 引导卡
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tbody><tr><td>',
        '<p style="font-size:24px;line-height:1;font-weight:500;margin:32px 0 16px 0;text-align:center;">喜欢这个博客？</p>',
        '</td></tr></tbody>',
        '</table>',
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tbody><tr><td align="center">',
        '<a href="' + (article.blog_url || 'http://localhost:5173') + '" style="color:rgb(0,126,255);text-decoration:none;display:inline-block;">',
        '<img alt="Justin的blog" height="28" width="28" src="http://localhost:5173/logo.png" style="display:inline-block;outline:none;border:none;text-decoration:none;vertical-align:middle;border-radius:50%;margin-right:8px;" />',
        '<span style="font-size:14px;font-weight:400;text-decoration:none;vertical-align:middle;color:rgb(0,126,255);">访问 Justin的blog 主页</span>',
        '</a>',
        '</td></tr></tbody>',
        '</table>',

        // 分隔线
        '<hr style="width:100%;border:none;border-color:transparent;border-top:1px solid #eaeaea;margin:65px 0 20px 0;" />',

        // 退订
        '<p style="font-size:12px;line-height:normal;color:rgb(102,102,102);margin:0 0 16px 0;text-align:center;">',
        '你收到这封邮件是因为你订阅了 <strong>Justin.Li</strong> 的 <strong>Justin的blog</strong>。',
        '<br>',
        '如不想再收到此类邮件，<a href="' + unsubscribeUrl + '" style="color:rgb(0,115,255);text-decoration:none;">点击此处退订</a>。',
        '</p>',

        // 底部 Logo
        '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tbody><tr><td align="center" style="display:block;margin-top:40px;">',
        '<img alt="Justin的blog" height="26" width="26" src="http://localhost:5173/logo.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto;border-radius:50%;" />',
        '</td></tr></tbody>',
        '</table>',

        // 底部链接
        '<p style="font-size:12px;line-height:24px;margin:8px 0 0 0;text-align:center;color:rgb(102,102,102);">',
        '<a href="' + (article.blog_url || 'http://localhost:5173') + '" style="color:rgb(0,115,255);text-decoration:none;">主页</a>',
        ' • ',
        '<a href="' + (article.blog_url || 'http://localhost:5173') + '/subscribe" style="color:rgb(0,115,255);text-decoration:none;">订阅管理</a>',
        ' • ',
        '<a href="' + (article.blog_url || 'http://localhost:5173') + '/about" style="color:rgb(0,115,255);text-decoration:none;">关于</a>',
        '</p>',

        // 版权
        '<p style="font-size:12px;line-height:24px;margin:25px 0 0 0;text-align:center;color:rgb(102,102,102);">',
        'Copyright © 2025-' + new Date().getFullYear() + ' Justin的blog<br />',
        '由 Justin.Li 倾情呈现',
        '</p>',

        '</td>',
        '</tr>',
        '</tbody>',
        '</table>',

        '</td>',
        '</tr>',
        '</tbody>',
        '</table>',

        '</body>',
        '</html>'
    ].join('\n');
}

// ============================================
// 发送函数
// ============================================
async function sendMail(to, subject, html) {
    return await transporter.sendMail({
        from: '"' + fromName + '" <' + process.env.EMAIL_USER + '>',
        to: to,
        subject: subject,
        html: html
    });
}

async function sendVerifyCode(to, code) {
    return await sendMail(to, '【Justin的blog by Justin.Li】登录验证码', buildCodeMailHtml('登录管理后台', code));
}

async function sendRegisterVerifyCode(to, code) {
    return await sendMail(to, '【Justin的blog by Justin.Li】注册验证码', buildCodeMailHtml('注册账号', code));
}

async function sendResetPasswordCode(to, code) {
    return await sendMail(to, '【Justin的blog by Justin.Li】密码重置验证码', buildCodeMailHtml('重置密码', code));
}

async function sendNewArticleNotification(to, article) {
    return await sendMail(to, '【Justin的blog by Justin.Li】新文章: ' + (article.title || ''), buildArticleMailHtml(Object.assign({}, article, { _to: to })));
}

async function sendNewArticleNotificationBatch(emails, article) {
    const result = { success: 0, failed: 0, errors: [] };
    for (const email of emails) {
        try {
            await sendNewArticleNotification(email, article);
            result.success++;
            await new Promise(r => setTimeout(r, 300));
        } catch (err) {
            result.failed++;
            result.errors.push({ email, error: err.message });
        }
    }
    return result;
}

module.exports = {
    sendVerifyCode,
    sendRegisterVerifyCode,
    sendResetPasswordCode,
    sendNewArticleNotification,
    sendNewArticleNotificationBatch
};
