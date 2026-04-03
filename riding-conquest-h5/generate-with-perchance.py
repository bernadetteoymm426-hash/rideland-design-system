#!/usr/bin/env python3
"""
使用 Perchance AI 生成中国风 UI 素材
Perchance: https://perchance.org/ai-text-to-image
完全免费，免登录
"""

import requests
import time
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "public" / "assets" / "decorations"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 提示词（英文效果更好）
PROMPTS = {
    "cloud-corner-tl": "Chinese traditional auspicious cloud corner decoration top left, golden xiangyun pattern, ornate UI frame corner element, layered cloud design with gradient gold colors, elegant and noble, cream white background, high quality digital art, color palette #D4AF37 gold #F5E6D3 cream, 1:1 aspect ratio",
    
    "cloud-corner-tr": "Chinese traditional auspicious cloud corner decoration top right, golden xiangyun pattern, ornate UI frame corner element, layered cloud design with gradient gold colors, elegant and noble, cream white background, high quality digital art, color palette #D4AF37 gold #F5E6D3 cream, 1:1 aspect ratio",
    
    "cloud-corner-bl": "Chinese traditional auspicious cloud corner decoration bottom left, golden xiangyun pattern, ornate UI frame corner element, layered cloud design with gradient gold colors, elegant and noble, cream white background, high quality digital art, color palette #D4AF37 gold #F5E6D3 cream, 1:1 aspect ratio",
    
    "cloud-corner-br": "Chinese traditional auspicious cloud corner decoration bottom right, golden xiangyun pattern, ornate UI frame corner element, layered cloud design with gradient gold colors, elegant and noble, cream white background, high quality digital art, color palette #D4AF37 gold #F5E6D3 cream, 1:1 aspect ratio",
    
    "hui-border": "Chinese traditional meander pattern border frame, hui wen geometric design, golden continuous border pattern, square frame with hollow center, classical Chinese ornament for UI card decoration, elegant and refined, high resolution digital art, color palette #D4AF37 gold on cream #F5E6D3 background, 1:1 aspect ratio",
    
    "cloud-divider": "Chinese style horizontal divider line, golden cloud pattern in center, thin gradient lines extending to both sides, traditional xiangyun ornament, elegant separator for UI design, cream white background, high quality digital illustration, color palette #D4AF37 gold fading to transparent at ends, wide aspect ratio",
    
    "knot-divider": "Chinese traditional knot divider, red Chinese knot with golden tassels, horizontal decorative separator, festive yet elegant, detailed craftsmanship, for UI section division, cream background, high quality digital art, colors Chinese red #C41E3A and golden #D4AF37, wide aspect ratio"
}

def generate_with_perchance(prompt: str, output_path: str):
    """
    使用 Perchance AI 生成图片
    API: https://perchance.org/ai-text-to-image
    """
    try:
        print(f"正在生成：{output_path.name}")
        print(f"提示词：{prompt[:80]}...")
        
        # Perchance 的 API 端点
        # 注意：这是非官方 API，可能变化
        url = "https://api.perchance.org/generate"
        
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        }
        
        data = {
            "prompt": prompt,
            "width": 1024,
            "height": 1024,
            "steps": 30,
            "guidance": 7.5,
            "seed": -1
        }
        
        response = requests.post(url, json=data, headers=headers, timeout=120)
        response.raise_for_status()
        
        # 保存结果
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        file_size = os.path.getsize(output_path)
        print(f"✅ 生成成功：{file_size / 1024:.1f} KB")
        return True
        
    except Exception as e:
        print(f"❌ 生成失败：{e}")
        return False

def main():
    print("🎨 使用 Perchance AI 生成中国风 UI 素材")
    print("=" * 60)
    
    for name, prompt in PROMPTS.items():
        output_path = OUTPUT_DIR / f"{name}.jpg"
        
        # 跳过已存在的
        if output_path.exists():
            print(f"⏭️  跳过：{name} (已存在)")
            continue
        
        success = generate_with_perchance(prompt, output_path)
        
        if success:
            time.sleep(2)  # 避免限流
        
        print()
    
    print("=" * 60)
    print("生成完成！")
    print(f"输出目录：{OUTPUT_DIR}")

if __name__ == "__main__":
    import os
    main()
