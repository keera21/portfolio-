import re

def update_index_css():
    with open('src/index.css', 'r') as f:
        content = f.read()
    
    # Add new fonts
    new_imports = '@import url("https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap");\n@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700;800&display=swap");'
    content = re.sub(r'@import url\("https://fonts\.googleapis\.com.*?;\n?', new_imports + '\n', content, count=1)
    
    with open('src/index.css', 'w') as f:
        f.write(content)

def update_landing_tsx():
    with open('src/components/Landing.tsx', 'r') as f:
        content = f.read()
    
    old_block = """          <div className="landing-info">
            <h3>Mechatronics Engineer</h3>
            <h2 className="landing-info-h2">
              <div style={{ whiteSpace: "nowrap" }}>Specializing&nbsp;in</div>
            </h2>
            <h2>
              <div className="landing-h2-info" style={{ whiteSpace: "nowrap" }}>Autonomous&nbsp;Robotics</div>
            </h2>
          </div>"""

    new_block = """          <div className="landing-info">
            <h3 className="landing-mechatronics">Mechatronics Engineer</h3>
            <h4 className="landing-specializing">specializing in</h4>
            <h2 className="landing-robotics">AUTONOMOUS ROBOTICS</h2>
          </div>"""
    
    content = content.replace(old_block, new_block)
    
    with open('src/components/Landing.tsx', 'w') as f:
        f.write(content)

def update_initial_fx():
    with open('src/components/utils/initialFX.ts', 'r') as f:
        content = f.read()
    
    # Replace references to landing-info h3 etc with the new ones
    content = content.replace(
        '[".landing-info h3", ".landing-intro h2", ".landing-intro h1"]',
        '[".landing-mechatronics", ".landing-specializing", ".landing-robotics", ".landing-intro h2", ".landing-intro h1"]'
    )
    
    # Remove obsolete animations
    obsolete = """  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  var landingText2 = new SplitText(".landing-h2-info", TextProps);
  gsap.fromTo(
    landingText2.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );"""
    
    content = content.replace(obsolete, "")
    
    with open('src/components/utils/initialFX.ts', 'w') as f:
        f.write(content)

def rewrite_landing_css():
    with open('src/components/styles/Landing.css', 'r') as f:
        lines = f.readlines()
        
    out = []
    # We will remove the old classes manually and insert the new ones.
    # Lines representing .landing-info h3, h2, h2.landing-info-h2 etc.
    skip = False
    for line in lines:
        if re.match(r'^\s*\.landing-info (h3|h2) {', line) or re.match(r'^\s*h2\.landing-info-h2 {', line) or re.match(r'^\s*\.landing-h2-', line) or re.match(r'^\s*\.landing-info-h2::', line):
            skip = True
        
        if not skip:
            out.append(line)
            
        if skip and line.strip() == "}":
            skip = False

    # Find position to insert Base classes (after .landing-info block ~ line 200)
    for i, l in enumerate(out):
        if ".landing-info {" in l:
            insert_idx = i + 10 # approximate after block
            break
            
    base_css = """
.landing-mechatronics {
  font-family: "Space Grotesk", sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #14b8a6, #5eead4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin: 0;
  font-size: 20px;
  white-space: nowrap;
}

.landing-specializing {
  font-family: "Inter", sans-serif;
  font-weight: 500;
  color: #a0aec0;
  font-size: 14px;
  letter-spacing: 1px;
  margin: 5px 0;
  white-space: nowrap;
  text-transform: lowercase;
}

.landing-robotics {
  font-family: "Space Grotesk", sans-serif;
  font-weight: 800;
  letter-spacing: 2px;
  color: #f8f9fa;
  font-size: 24px;
  margin: 0;
  white-space: nowrap;
}
"""
    # Insert media query overrides manually to out array
    # 500px 
    idx_500 = ''.join(out).find('@media screen and (min-width: 500px)')
    # 768px
    idx_768 = ''.join(out).find('@media screen and (min-width: 768px)')
    # 1600px
    idx_1600 = ''.join(out).find('@media screen and (min-width: 1600px)')
    
    new_css = ''.join(out)
    new_css = new_css.replace('.landing-info {', base_css + '\n.landing-info {', 1)
    
    new_css = new_css.replace('@media screen and (min-width: 500px) {', 
    '@media screen and (min-width: 500px) {\n  .landing-mechatronics { font-size: 22px; }\n  .landing-specializing { font-size: 14px; }\n  .landing-robotics { font-size: 28px; }\n')

    new_css = new_css.replace('@media screen and (min-width: 768px) {', 
    '@media screen and (min-width: 768px) {\n  .landing-mechatronics { font-size: 30px; }\n  .landing-specializing { font-size: 18px; }\n  .landing-robotics { font-size: 40px; }\n')

    new_css = new_css.replace('@media screen and (min-width: 1600px) {', 
    '@media screen and (min-width: 1600px) {\n  .landing-mechatronics { font-size: 42px; }\n  .landing-specializing { font-size: 22px; }\n  .landing-robotics { font-size: 55px; }\n')

    with open('src/components/styles/Landing.css', 'w') as f:
        f.write(new_css)

if __name__ == '__main__':
    update_index_css()
    update_landing_tsx()
    update_initial_fx()
    rewrite_landing_css()
    print("Done")
