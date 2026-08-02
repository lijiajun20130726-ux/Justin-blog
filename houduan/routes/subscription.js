const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const ResponseHelper = require('../utils/response');

// 订阅
router.post('/subscribe', [
    body('email').trim().isEmail().withMessage('邮箱格式不正确')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseHelper.error(res, errors.array()[0].msg);
        }

        const { email } = req.body;
        const ip = req.ip;

        // 检查是否已订阅
        const [existing] = await pool.query('SELECT id, status FROM subscriptions WHERE email = ?', [email]);
        
        if (existing.length > 0) {
            if (existing[0].status === 1) {
                return ResponseHelper.error(res, '该邮箱已订阅');
            } else {
                // 重新激活
                await pool.query('UPDATE subscriptions SET status = 1, ip = ? WHERE id = ?', [ip, existing[0].id]);
                return ResponseHelper.success(res, null, '订阅成功');
            }
        }

        await pool.query('INSERT INTO subscriptions (email, ip, status) VALUES (?, ?, 1)', [email, ip]);
        ResponseHelper.success(res, null, '订阅成功');
    } catch (error) {
        ResponseHelper.serverError(res, error);
    }
});

// 退订
router.post('/unsubscribe', [
    body('email').trim().isEmail().withMessage('邮箱格式不正确')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ResponseHelper.error(res, errors.array()[0].msg);
        }

        const { email } = req.body;

        const [existing] = await pool.query('SELECT id, status FROM subscriptions WHERE email = ?', [email]);
        if (existing.length === 0) {
            return ResponseHelper.error(res, '该邮箱未订阅');
        }

        if (existing[0].status === 0) {
            return ResponseHelper.success(res, { alreadyUnsubscribed: true }, '你已退订过');
        }

        await pool.query('UPDATE subscriptions SET status = 0 WHERE email = ?', [email]);
        ResponseHelper.success(res, { alreadyUnsubscribed: false }, '已退订');
    } catch (error) {
        ResponseHelper.serverError(res, error);
    }
});

// 邮件一键退订（GET 链接，浏览器直接访问）
router.get('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).send(unsubscribeErrorPage('无效的退订链接，缺少邮箱参数。'));
        }

        const [existing] = await pool.query('SELECT id, status FROM subscriptions WHERE email = ?', [email]);
        if (existing.length === 0) {
            return res.status(404).send(unsubscribeErrorPage('该邮箱尚未订阅，无需退订。'));
        }

        if (existing[0].status === 0) {
            return res.status(200).send(unsubscribeSuccessPage(email, true));
        }

        await pool.query('UPDATE subscriptions SET status = 0 WHERE email = ?', [email]);
        return res.status(200).send(unsubscribeSuccessPage(email, false));
    } catch (error) {
        console.error('退订失败:', error);
        return res.status(500).send(unsubscribeErrorPage('服务器错误，请稍后重试。'));
    }
});

function unsubscribeSuccessPage(email, alreadyUnsubscribed) {
    const blogUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const title = alreadyUnsubscribed ? '你已退订' : '退订成功';
    const subtitle = alreadyUnsubscribed
        ? '你之前就已经退订过了，无需再次操作。'
        : '很遗憾看到你离开。如果改主意了，随时欢迎再次订阅。';
    return [
        '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        '<title>' + title + ' | Justin的blog by Justin.Li</title>',
        '<style>',
        'body{margin:0;padding:0;min-height:100vh;background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 50%,#6366f1 100%);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;padding:20px;}',
        '.card{background:#fff;border-radius:24px;padding:48px 40px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center;}',
        '.icon{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);margin:0 auto 24px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(16,185,129,0.3);}',
        '.icon svg{width:44px;height:44px;color:#fff;}',
        'h1{font-size:28px;font-weight:800;color:#1f2937;margin:0 0 12px;}',
        'p{font-size:15px;color:#6b7280;margin:0 0 8px;line-height:1.6;}',
        '.email{background:#f3f4f6;border-radius:8px;padding:8px 16px;display:inline-block;font-family:monospace;font-size:13px;color:#2563eb;margin:12px 0 24px;}',
        '.actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:24px;}',
        '.btn{padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;transition:all 0.2s;display:inline-block;}',
        '.btn-primary{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;box-shadow:0 4px 12px rgba(37,99,235,0.3);}',
        '.btn-secondary{background:#f3f4f6;color:#374751;}',
        'small{font-size:12px;color:#9ca3af;display:block;margin-top:24px;}',
        '</style></head><body>',
        '<div class="card">',
        '<div class="icon"><svg fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>',
        '<h1>' + title + '</h1>',
        '<p>' + subtitle + '</p>',
        '<div class="email">' + email + '</div>',
        '<p>已成功从 <strong>Justin的blog by Justin.Li</strong> 的订阅列表中移除。</p>',
        '<div class="actions">',
        '<a href="' + blogUrl + '/subscribe" class="btn btn-primary">重新订阅</a>',
        '<a href="' + blogUrl + '" class="btn btn-secondary">访问博客</a>',
        '</div>',
        '<small>—— Justin.Li @ Justin的blog</small>',
        '</div></body></html>'
    ].join('');
}

function unsubscribeErrorPage(message) {
    const blogUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return [
        '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        '<title>退订失败 | Justin的blog by Justin.Li</title>',
        '<style>',
        'body{margin:0;padding:0;min-height:100vh;background:linear-gradient(135deg,#dc2626 0%,#b91c1c 100%);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;padding:20px;}',
        '.card{background:#fff;border-radius:24px;padding:48px 40px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center;}',
        '.icon{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#d97706);margin:0 auto 24px;display:flex;align-items:center;justify-content:center;}',
        '.icon svg{width:44px;height:44px;color:#fff;}',
        'h1{font-size:24px;font-weight:800;color:#1f2937;margin:0 0 12px;}',
        'p{font-size:15px;color:#6b7280;margin:0 0 24px;line-height:1.6;}',
        '.btn{padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;display:inline-block;}',
        '</style></head><body>',
        '<div class="card">',
        '<div class="icon"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>',
        '<h1>退订失败</h1>',
        '<p>' + message + '</p>',
        '<a href="' + blogUrl + '" class="btn">返回博客</a>',
        '</div></body></html>'
    ].join('');
}

// 获取订阅列表（后台）
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10, email, status } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        let whereClause = 'WHERE 1=1';
        let params = [];

        if (email) {
            whereClause += ' AND email LIKE ?';
            params.push(`%${email}%`);
        }

        if (status !== undefined) {
            whereClause += ' AND status = ?';
            params.push(parseInt(status));
        }

        const [subscriptions] = await pool.query(
            `SELECT * FROM subscriptions ${whereClause} ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`,
            params
        );

        const [countResult] = await pool.query(
            `SELECT COUNT(*) as total FROM subscriptions ${whereClause}`,
            params
        );

        ResponseHelper.paginate(res, subscriptions, countResult[0].total, pageNum, limitNum);
    } catch (error) {
        ResponseHelper.serverError(res, error);
    }
});

// 获取订阅统计（后台）
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM subscriptions');
        const [activeResult] = await pool.query('SELECT COUNT(*) as active FROM subscriptions WHERE status = 1');
        
        // 获取最近7天的订阅趋势
        const [trendResult] = await pool.query(`
            SELECT DATE(created_at) as date, COUNT(*) as count 
            FROM subscriptions 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        ResponseHelper.success(res, {
            total: totalResult[0].total,
            active: activeResult[0].active,
            trend: trendResult
        });
    } catch (error) {
        ResponseHelper.serverError(res, error);
    }
});

// 删除订阅（后台）
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM subscriptions WHERE id = ?', [id]);
        ResponseHelper.success(res, null, '删除成功');
    } catch (error) {
        ResponseHelper.serverError(res, error);
    }
});

// 批量删除订阅（后台）
router.delete('/batch/delete', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return ResponseHelper.error(res, '参数错误', 400);
        }

        const placeholders = ids.map(() => '?').join(',');
        await pool.query(`DELETE FROM subscriptions WHERE id IN (${placeholders})`, ids);
        ResponseHelper.success(res, null, '批量删除成功');
    } catch (error) {
        ResponseHelper.serverError(res, error);
    }
});

// 导出订阅列表（后台）
router.get('/export', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.query;
        let sql = 'SELECT email, status, ip, created_at FROM subscriptions';
        let params = [];

        if (status !== undefined) {
            sql += ' WHERE status = ?';
            params.push(parseInt(status));
        }

        sql += ' ORDER BY created_at DESC';
        const [subscriptions] = await pool.query(sql, params);
        
        ResponseHelper.success(res, subscriptions);
    } catch (error) {
        ResponseHelper.serverError(res, error);
    }
});

module.exports = router;
