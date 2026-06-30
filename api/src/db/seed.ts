import 'dotenv/config';
import { db } from './index.js';
import { admins } from './schema.js';
import { eq } from 'drizzle-orm';

function assertCigarDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is required for seed.');
    process.exit(1);
  }

  let databaseName = '';
  try {
    const parsed = new URL(dbUrl);
    databaseName = parsed.pathname.replace(/^\//, '');
  } catch {
    console.error('❌ DATABASE_URL must be a valid PostgreSQL URL.');
    process.exit(1);
  }

  if (databaseName !== 'cigar') {
    console.error(`❌ Refusing seed: target database must be "cigar", got "${databaseName || '(empty)'}".`);
    process.exit(1);
  }
}

async function seed() {
  assertCigarDatabase();

  const username = process.env.ADMIN_USERNAME || 'admin';
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    console.error('❌ ADMIN_PASSWORD_HASH not set in .env');
    console.log('\n生成方法:');
    console.log('  node -e "console.log(require(\'bcryptjs\').hashSync(\'你的密码\', 10))"');
    process.exit(1);
  }

  // 检查是否已存在
  const existing = await db.select().from(admins).where(eq(admins.username, username));
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
