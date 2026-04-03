#!/usr/bin/env python3
"""
白金帝王风 UI 素材生成器
使用免费 AI 服务生成高质量中国风装饰素材
"""

import requests
import base64
import os
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "public" / "assets" / "decorations"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 提示词模板
PROMPTS = {
    "cloud-corner": """
Chinese traditional auspicious cloud corner decoration, golden xiangyun pattern,
ornate UI frame corner element, classical Chinese ornament style,
detailed layered cloud design with gradient gold colors,
elegant and noble, for mobile app card decoration,
cream white background, high quality digital art,
color palette: #D4AF37 gold, #F5E6D3 cream, #C9A961 bronze
--ar 1:1 --q 2 --style raw
    """,
    
    "hui-border": """
Chinese traditional meander pattern border frame, hui wen geometric design,
golden continuous border pattern, square frame with hollow center,
classical Chinese ornament for UI card decoration,
elegant and refined, high resolution digital art,
color palette: #D4AF37 gold on cream #F5E6D3 background
--ar 1:1 --q 2
    """,
    
    "cloud-divider": """
Chinese style horizontal divider line, golden cloud pattern in center,
thin gradient lines extending to both sides,
traditional xiangyun ornament, elegant separator for UI,
cream white background, high quality digital illustration,
color palette: #D4AF37 gold, fading to transparent at ends
--ar 10:1 --q 2
    """,
    
    "knot-divider": """
Chinese traditional knot divider, red Chinese knot with golden tassels,
horizontal decorative separator, festive yet elegant,
detailed craftsmanship, for UI section division,
cream background, high quality digital art,
colors: Chinese red #C41E3A and golden #D4AF37
--ar 8:1 --q 2
    """
}

def generate_with_pollinations(prompt: str, output_path: str, width: int = 1024, height: int = 1024):
    """
    使用 Pollinations.ai 免费 API 生成图片
    文档：https://pollinations.ai/docs/
    """
    try:
        # 清理提示词
        clean_prompt = prompt.strip().replace('\n', ' ')
        
        # 构建 URL
        url = f"https://image.pollinations.ai/prompt/{requests.utils.quote(clean_prompt)}"
        url += f"?width={width}&height={height}&nologo=true&seed={abs(hash(prompt)) % 10000}"
        
        print(f"正在生成：{output_path}")
        print(f"提示词：{clean_prompt[:100]}...")
        
        # 下载图片
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        
        # 保存
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        file_size = os.path.getsize(output_path)
        print(f"✅ 生成成功：{file_size / 1024:.1f} KB")
        return True
        
    except Exception as e:
        print(f"❌ 生成失败：{e}")
        return False

def main():
    print("🎨 白金帝王风 UI 素材生成器")
    print("=" * 50)
    
    tasks = [
        ("cloud-corner-tl.jpg", PROMPTS["cloud-corner"], 1024, 1024),
        ("cloud-corner-tr.jpg", PROMPTS["cloud-corner"], 1024, 1024),
        ("cloud-corner-bl.jpg", PROMPTS["cloud-corner"], 1024, 1024),
        ("cloud-corner-br.jpg", PROMPTS["cloud-corner"], 1024, 1024),
        ("hui-border.jpg", PROMPTS["hui-border"], 1024, 1024),
        ("cloud-divider.jpg", PROMPTS["cloud-divider"], 1600, 160),
        ("knot-divider.jpg", PROMPTS["knot-divider"], 1600, 200),
    ]
    
    success = 0
    for filename, prompt, w, h in tasks:
        output_path = OUTPUT_DIR / filename
        if generate_with_pollinations(prompt, output_path, w, h):
            success += 1
        print()
    
    print("=" * 50)
    print(f"✅ 完成：{success}/{len(tasks)} 个素材")
    print(f"输出目录：{OUTPUT_DIR}")

if __name__ == "__main__":
    main()
