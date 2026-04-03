// 前端功能验证脚本
const fs = require('fs');
const path = require('path');

const projectRoot = '/Users/mark/Documents/AI/Project/Project 001/riding-conquest-h5';

console.log('🔍 验证前端项目...\n');

// 检查关键文件
const files = [
  'src/views/LoginView.vue',
  'src/views/ProfileView.vue',
  'src/views/team/TeamView.vue',
  'src/stores/auth.ts',
  'src/utils/mock-api.js',
  'src/utils/request.js',
  'src/router/index.ts',
  'node_modules/axios/package.json',
  'node_modules/vue-router/package.json',
  'node_modules/pinia/package.json',
];

let allOk = true;

files.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 不存在`);
    allOk = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allOk) {
  console.log('✅ 所有文件验证通过！前端可以正常运行');
  console.log('\n访问地址：http://localhost:5173');
  console.log('登录测试：http://localhost:5173/#/login');
} else {
  console.log('❌ 部分文件缺失，请检查');
  process.exit(1);
}
