import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

type MysqlPool = mysql.Pool;

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: MysqlPool | undefined;
}

function getSslConfig(): mysql.ConnectionOptions["ssl"] {
  // 우선순위 1: DB_SSL_CA 환경변수에 직접 키 내용을 넣는 방식 (Vercel 배포용)
  const caContent = process.env.DB_SSL_CA;
  if (caContent) {
    // 환경변수에 \n 이스케이프 시퀀스가 문자열로 들어온 경우 실제 개행 문자로 변환
    const normalizedCa = caContent.replace(/\\n/g, "\n");
    return { ca: normalizedCa } as unknown as mysql.SslOptions;
  }

  // 우선순위 2: DB_SSL_CA_PATH로 파일 경로 지정 (로컬 개발용)
  const caPath = process.env.DB_SSL_CA_PATH;
  if (!caPath) return undefined;

  try {
    const resolved = path.isAbsolute(caPath)
      ? caPath
      : path.join(process.cwd(), caPath);
    const ca = fs.readFileSync(resolved, "utf8");
    return { ca } as unknown as mysql.SslOptions;
  } catch (err) {
    // CA 파일을 못 읽어도 연결은 시도할 수 있게 ssl 생략
    return undefined;
  }
}

export function getPool(): MysqlPool {
  if (!global.mysqlPool) {
    const ssl = getSslConfig();
    global.mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_POOL_LIMIT || 10),
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return global.mysqlPool;
}
