import nodemailer from 'nodemailer';

/**
 * 邮件服务配置
 * 从环境变量读取配置，避免硬编码敏感信息
 */
export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    to?: string;
}

/**
 * 获取邮件配置
 * 如果未配置环境变量，返回 null
 */
export const getEmailConfig = (): EmailConfig | null => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // 必需配置检查
    if (!host || !port || !user || !pass) {
        console.warn('邮件配置不完整，跳过邮件发送功能');
        console.warn('请在 .env 文件中配置 SMTP_* 相关变量');
        return null;
    }

    return {
        host,
        port: parseInt(port),
        secure: process.env.SMTP_SECURE === 'true',
        user,
        pass,
        to: process.env.SMTP_TO
    };
};

/**
 * 创建邮件传输器
 */
export const createTransporter = () => {
    const config = getEmailConfig();

    if (!config) {
        return null;
    }

    return {
        transporter: nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.pass
            }
        }),
        config
    };
};

/**
 * 发送邮件
 */
export const sendEmail = async (html: string, subject: string = '邮件主题') => {
    const mailSetup = createTransporter();

    if (!mailSetup) {
        console.log('邮件功能未配置，跳过发送');
        return false;
    }

    const { transporter, config } = mailSetup;

    const mailOptions = {
        from: config.user,
        to: config.to || config.user,
        subject,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('邮件发送成功:', info.messageId);
        return true;
    } catch (error) {
        console.error('邮件发送失败:', error);
        return false;
    }
};
