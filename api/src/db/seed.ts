import 'dotenv/config';
import { db } from './index.js';
import { admins } from './schema.js';

async function seed() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    console.error('❌ ADMIN_PASSWORD_HASH not set in .env');
    console.log('\n生成方法:');
    console.log('  node -e "console.log(require(\'bcryptjs\').hashSync(\'你的密码\', 10))"');
    process.exit(1);
  }

  // 检查是否已存在
  const existing = await db.select().from(admins).where((users) => users.username === username);
  if (existing.length > 0) {
    console.log(`ℹ️  管理员 "${username}" 已存在，跳过创建`);
    return;
  }

  // 创建管理员
  await db.insert(admins).values({ username, passwordHash });
  console.log(`✅ 管理员创建成功: ${username}`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
