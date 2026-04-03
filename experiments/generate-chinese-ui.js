const fs = require('fs');
const path = require('path');

// 阿里云百炼 API 配置
const API_KEY = 'sk-sp-af34df8f2ea14f398a5a01b6087be65f';
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';

// 输出目录
const OUTPUT_DIR = path.join(__dirname, 'generated-ui-images');

// 8 个中国风游戏 UI 界面的详细提示词
const UI_PROMPTS = [
  {
    name: '01-friend-arena',
    prompt: `中国武侠风格游戏 UI 界面设计，好友切磋界面。
    
    【整体风格】深夜蓝色背景 #0d1118，古铜金色装饰 #c9a962，传统中国风纹样，卷轴质感
    
    【布局结构】
    - 顶部：标题栏"好友切磋"，金色边框装饰，两侧龙纹图案
    - 左侧：好友列表区域，每个好友卡片显示头像、等级、战力，选中状态金色高亮
    - 右侧：对战信息面板，显示双方角色立绘、属性对比
    - 底部：三个按钮"发起切磋"、"观战"、"返回"，金色渐变按钮
    
    【装饰元素】
    - 边框：深蓝色底 + 金色回纹边框
    - 背景：淡入的山水墨迹纹理
    - 角饰：四角金色云纹装饰
    - 分隔线：金色细线带光晕
    
    【文字】中文古风字体，主标题金色描边，正文米白色 #f0e6d2
    
    高清游戏 UI 设计，专业品质，细节丰富，8k 分辨率`
  },
  {
    name: '02-competition-arena',
    prompt: `中国武侠风格游戏 UI 界面设计，竞技场排名界面。
    
    【整体风格】深蓝 + 金色主调，威严大气的竞技场氛围
    
    【布局结构】
    - 顶部：标题"竞技场"，金色奖杯图标，当前赛季信息
    - 中央：排名榜单区域，1-3 名特殊金色边框，4-10 名普通列表
    - 排名项：显示排名数字、玩家头像、昵称、等级、战力值、徽章
    - 右侧：个人战绩面板，胜场、负场、胜率、当前段位
    - 底部：按钮"挑战"、"战绩"、"奖励"、"返回"
    
    【视觉特色】
    - 冠军位置：金色龙椅背景，特殊光效
    - 段位徽章：青铜、白银、黄金、钻石不同样式
    - 战力数字：金色渐变高亮
    
    【装饰】传统云纹、回纹边框、印章元素
    
    专业游戏 UI 设计，竞技氛围浓厚，高细节度`
  },
  {
    name: '03-item-bestiary',
    prompt: `中国武侠风格游戏 UI 界面设计，道具图鉴/角色图鉴界面。
    
    【整体风格】古朴卷轴风格，米白背景 #f5ebe0，青蓝色边框 #1a3a5c
    
    【布局结构】
    - 顶部：标题"道具图鉴"，分类筛选标签（全部/武器/防具/道具/材料）
    - 左侧：分类导航树，展开收起效果
    - 中央：网格展示区，3 列×4 行，每个道具卡片包含：
      * 道具图标（居中）
      * 道具名称（下方）
      * 品质边框（白/绿/蓝/紫/橙）
      * 收集进度标记
    - 右侧：详情面板，选中道具的详细信息、属性、来源
    
    【装饰元素】
    - 卡片边框：对应品质的光晕
    - 背景：淡雅的竹子或梅花暗纹
    - 分隔：传统窗格图案
    
    【文字】黑色正文 #2d3748，金色标题 #c9a962
    
    清新雅致的中国风 UI，博物馆级展示效果`
  },
  {
    name: '04-talent-tree',
    prompt: `中国武侠风格游戏 UI 界面设计，天赋树系统界面。
    
    【整体风格】神秘深邃的深蓝背景，金色节点连线，八卦阵元素
    
    【布局结构】
    - 中央：天赋树主图，从下往上延伸的树状结构
      * 节点：圆形金色边框，内含图标，已解锁节点发光
      * 连线：金色能量线，已激活线路流动光效
      * 分支：内功、外功、轻功三大分支
    - 左侧：天赋分类筛选，当前天赋点数量显示
    - 右侧：选中天赋详情，效果描述、前置条件、学习按钮
    - 顶部：玩家当前总战力、天赋点余额
    
    【视觉特效】
    - 节点光晕：已解锁金色，未解锁灰色
    - 能量流动：连线上有金色光点移动
    - 背景：星空 + 八卦阵暗纹
    
    【按钮】"一键重置"、"确认学习"、"返回"
    
    玄幻武侠风格，科技感与传统元素融合`
  },
  {
    name: '05-guild-notice',
    prompt: `中国武侠风格游戏 UI 界面设计，帮派公告/原动公告界面。
    
    【整体风格】圣旨卷轴风格，米黄卷轴背景，红色印章
    
    【布局结构】
    - 顶部：标题横幅"帮派公告"，两侧红色流苏装饰
    - 中央：卷轴展开区域，公告列表
      * 每条公告：标题、发布者、时间、重要性标记（普通/重要/紧急）
      * 选中公告：展开详细内容，支持富文本
    - 右侧：公告分类筛选、搜索框
    - 底部：按钮"发布公告"（管理员可见）、"刷新"、"返回"
    
    【装饰元素】
    - 卷轴：上下金色轴头
    - 边框：红色回纹装饰
    - 印章：朱红色"公告"印章
    - 背景：宣纸纹理
    
    【文字】标题金色，正文黑色，重要内容红色高亮
    
    古典官方文书风格，庄重正式`
  },
  {
    name: '06-festival-event',
    prompt: `中国武侠风格游戏 UI 界面设计，节日活动界面。
    
    【整体风格】喜庆热闹的红色 + 金色主调，节日氛围浓厚
    
    【布局结构】
    - 顶部：活动主题横幅（如"春节庆典"），灯笼、烟花装饰
    - 中央：活动日历或活动卡片轮播
      * 每个活动卡片：活动图标、名称、进度条、奖励预览、剩余时间
      * 进行中活动：金色边框 + 光效
      * 已完成活动：灰色遮罩
    - 右侧：活动规则说明、奖励总览
    - 底部：按钮"参与活动"、"领取奖励"、"返回"
    
    【节日元素】
    - 装饰：灯笼、鞭炮、中国结、祥云
    - 特效：飘落的红包、烟花粒子
    - 背景：红色渐变 + 金色光点
    
    【文字】金色标题，白色正文，重要信息用红色
    
    热闹喜庆的节日 UI，吸引玩家参与`
  },
  {
    name: '07-friend-list',
    prompt: `中国武侠风格游戏 UI 界面设计，好友列表界面。
    
    【整体风格】简洁清爽的深蓝 + 米白配色，社交氛围
    
    【布局结构】
    - 顶部：标题"好友列表"，好友数量统计，搜索框
    - 分类标签：全部好友 / 在线好友 / 最近组队 / 黑名单
    - 好友列表：滚动列表，每个好友项包含：
      * 头像（带边框）
      * 昵称、等级、门派图标
      * 状态（在线/离线/战斗中）
      * 操作按钮（私聊、邀请、查看）
    - 右侧：好友详情面板（选中时显示）
    - 底部：按钮"添加好友"、"推荐好友"、"返回"
    
    【状态标识】
    - 在线：绿色圆点
    - 离线：灰色
    - 战斗中：红色剑图标
    
    【装饰】简约的云纹分隔线，金色选中框
    
    现代社交 UI 布局，中国风装饰点缀`
  },
  {
    name: '08-team-formation',
    prompt: `中国武侠风格游戏 UI 界面设计，编队/战队界面。
    
    【整体风格】军事作战风格，深蓝 + 青铜金，战旗元素
    
    【布局结构】
    - 顶部：标题"战队编成"，当前战队名称、战力总和
    - 中央：阵容展示区，6 个角色槽位（3 前 3 后）
      * 已上阵：角色立绘、等级、装备、状态
      * 空位：灰色占位符 + "选择角色"提示
      * 阵型：前中后三排，用传统阵法图表示
    - 左侧：可选角色列表，按品质/等级排序
    - 右侧：队伍详情，羁绊加成、推荐阵型
    - 底部：按钮"一键换阵"、"保存阵容"、"返回"
    
    【阵型元素】
    - 阵法图：八卦阵、雁行阵等古风阵型
    - 羁绊线：角色间金色连线显示羁绊激活
    
    【装饰】战旗、兵器架、军事地图背景
    
    战略感强烈的编队界面，排兵布阵氛围`
  }
];

// 调用阿里云百炼 API 生成图片
async function generateImage(prompt, outputPath) {
  try {
    console.log(`正在生成：${outputPath}`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'X-DashScope-Async': 'enable' // 异步调用
      },
      body: JSON.stringify({
        model: 'wan2.6-t2i',
        input: {
          prompt: prompt
        },
        parameters: {
          size: '1024*1024',
          n: 1,
          style: '<auto>'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败：${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('任务创建成功，Task ID:', data.output?.task_id);

    // 异步任务需要轮询获取结果
    if (data.output?.task_id) {
      return await pollTaskResult(data.output.task_id, outputPath);
    }

    return null;
  } catch (error) {
    console.error(`生成失败：${error.message}`);
    throw error;
  }
}

// 轮询异步任务结果
async function pollTaskResult(taskId, outputPath, maxAttempts = 60) {
  const taskUrl = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`;
  
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待 2 秒
    
    const response = await fetch(taskUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`查询任务失败：${response.status}`);
    }

    const taskData = await response.json();
    const phase = taskData.output?.phase;
    
    console.log(`  轮询 ${i + 1}/${maxAttempts} - 状态：${phase}`);

    if (phase === 'SUCCEEDED') {
      // 获取图片 URL
      const imageUrl = taskData.output?.results?.[0]?.url;
      if (imageUrl) {
        console.log(`  生成成功，下载图片：${imageUrl}`);
        return await downloadImage(imageUrl, outputPath);
      }
    } else if (phase === 'FAILED' || phase === 'CANCELED') {
      throw new Error(`任务失败：${taskData.output?.message || '未知错误'}`);
    }
  }

  throw new Error('轮询超时，任务未完成');
}

// 下载图片到本地
async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`下载图片失败：${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`  图片已保存：${outputPath}`);
  return outputPath;
}

// 主函数
async function main() {
  console.log('=== 中国风游戏 UI 生成工具 ===\n');
  console.log(`输出目录：${OUTPUT_DIR}\n`);

  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];
  const errors = [];

  // 逐个生成
  for (let i = 0; i < UI_PROMPTS.length; i++) {
    const ui = UI_PROMPTS[i];
    const outputPath = path.join(OUTPUT_DIR, `${ui.name}.png`);
    
    try {
      const result = await generateImage(ui.prompt, outputPath);
      results.push({ name: ui.name, path: outputPath, status: 'success' });
    } catch (error) {
      errors.push({ name: ui.name, error: error.message });
      results.push({ name: ui.name, status: 'failed', error: error.message });
    }

    // 每个生成之间等待一下，避免 API 限流
    if (i < UI_PROMPTS.length - 1) {
      console.log('等待 3 秒后继续...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // 输出结果摘要
  console.log('\n=== 生成完成 ===\n');
  console.log(`成功：${results.filter(r => r.status === 'success').length}/${UI_PROMPTS.length}`);
  console.log(`失败：${results.filter(r => r.status === 'failed').length}/${UI_PROMPTS.length}\n`);

  if (errors.length > 0) {
    console.log('失败详情：');
    errors.forEach(e => {
      console.log(`  - ${e.name}: ${e.error}`);
    });
  }

  console.log('\n所有生成的图片已保存到：', OUTPUT_DIR);
}

// 运行
main().catch(console.error);
