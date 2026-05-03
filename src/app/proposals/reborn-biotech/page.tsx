import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reborn Biotech – 新西兰数字曝光提案 | Magic Lab',
  description: '从隐形到主导：官网重建 · SEO搜索优化 · 社媒全矩阵 · AI推荐战略，助力高端脂质体品牌成为新西兰市场领导者',
  robots: 'noindex, nofollow',
};

export default function RebornBiotechProposal() {
  return (
    <div style={{ fontFamily: "'Noto Sans SC', sans-serif", backgroundColor: '#ffffff', color: '#1a2e3b', fontSize: '14px', lineHeight: 1.7, maxWidth: '900px', margin: '0 auto' }}>
      {/* COVER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 41, 34, 0.85) 0%, rgba(26, 77, 62, 0.85) 60%, rgba(10, 62, 50, 0.85) 100%), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80") center/cover',
        color: 'white',
        padding: '80px 60px 70px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 装饰圆形 */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 143, 0.15) 0%, transparent 70%)',
        }} />

        <div style={{
          display: 'inline-block',
          background: 'rgba(212, 175, 143, 0.25)',
          border: '1px solid rgba(212, 175, 143, 0.5)',
          color: '#f4d4a8',
          fontSize: '11px',
          letterSpacing: '2px',
          padding: '4px 14px',
          borderRadius: '20px',
          marginBottom: '28px',
          fontWeight: 500,
        }}>
          商业合作提案 · 保密文件
        </div>

        <h1 style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: '38px',
          fontWeight: 700,
          lineHeight: 1.25,
          marginBottom: '16px',
          position: 'relative',
          zIndex: 1,
        }}>
          Reborn Biotech<br />
          <span style={{ color: '#d4af8f' }}>新西兰数字曝光全案</span>
        </h1>

        <p style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '48px',
          maxWidth: '520px',
          position: 'relative',
          zIndex: 1,
        }}>
          从隐形到主导：官网重建 · SEO搜索优化 · 社媒全矩阵 · AI推荐战略<br />
          助力高端脂质体品牌成为新西兰市场领导者
        </p>

        <div style={{
          display: 'flex',
          gap: '40px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
          position: 'relative',
          zIndex: 1,
        }}>
          <div><strong style={{ display: 'block', color: 'rgba(255,255,255,0.95)', fontSize: '14px', marginBottom: '2px' }}>提案方</strong>Magic Lab</div>
          <div><strong style={{ display: 'block', color: 'rgba(255,255,255,0.95)', fontSize: '14px', marginBottom: '2px' }}>提案对象</strong>Reborn Biotech NZ</div>
          <div><strong style={{ display: 'block', color: 'rgba(255,255,255,0.95)', fontSize: '14px', marginBottom: '2px' }}>日期</strong>2026年5月</div>
          <div><strong style={{ display: 'block', color: 'rgba(255,255,255,0.95)', fontSize: '14px', marginBottom: '2px' }}>有效期</strong>30天</div>
        </div>
      </div>

      {/* 01 现状诊断 */}
      <Section num="01" label="现状诊断">
        <h2>品牌真实存在，数字资产为零</h2>
        <p>Reborn Biotech 拥有领先的脂质体纳米技术与优质的新西兰溯源，但当前的数字化能力严重制约了品牌在 NZ 市场的突破。以下四个核心痛点正在吞没你的机会成本：</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
          {[
            { title: '🔴 Google 搜索战场：一席之地都没有', desc: '搜 "Reborn Biotech"→ 全是中国湖北同名工厂；搜 "liposomal vitamin C NZ"→ ProNordic / HealthPost 占据，R&B 在前30位都找不到。' },
            { title: '🔴 社媒矩阵：5 个空白阵地', desc: 'IG / FB / TikTok / LinkedIn / 小红书 都没有官方账号。竞品 ProNordic IG 1.2万粉、LIPO-SACHETS TikTok 日更，而 R&B 的品牌声量接近零。' },
            { title: '🔴 AI Visibility：被遗忘的新战场', desc: 'ChatGPT / Perplexity 推荐高端脂质体补剂时，R&B 从不出现。AI 推荐率 0%，意味着 2026 年 30% 的购买决策起点完全失去。' },
            { title: '🔴 渠道分销曝光：零溶出', desc: 'HealthPost / Pharmacy Direct 等主流渠道没有品牌曝光。消费者无处获悉 R&B，转化链条从源头断裂。' },
          ].map((item) => (
            <div key={item.title} style={{
              background: 'white',
              border: '1px solid #d0dfe0',
              borderLeft: '4px solid #d84d42',
              borderRadius: '8px',
              padding: '20px',
            }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f2922', marginBottom: '6px' }}>{item.title}</h4>
              <p style={{ fontSize: '12.5px', color: '#5a7a8a', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 02 解决方案 */}
      <Section num="02" label="解决方案" bgLight>
        <h2>三维突破：Google × 社媒 × AI</h2>
        <p>我们将在 <strong>8–10周内完成官网重建 + 社媒矩阵搭建</strong>，同步启动 SEO、KOL 投放、PR 软文、AI 优化，形成"被搜到 × 被记住 × 被推荐"的完整闭环。</p>

        <div style={{ marginTop: '24px' }}>
          {[
            { num: '1', phase: '第 1–2 周', title: '官网技术 SEO 重构 + 社媒搭建', desc: '完成官网 Schema / Core Web Vitals 优化、Google/Bing/Apple Business 三联立、Wikipedia 品牌条目创建、IG/FB/TikTok/LinkedIn/小红书 账号搭建。2周内完成前置基建。' },
            { num: '2', phase: '第 1 个月起', title: 'SEO 内容爆发 + KOL 矩阵投放', desc: '每月产出 20 篇 SEO 优化文章（脂质体科学、产品对比、新西兰溯源、使用场景），同时启动 3–5 位 NZ 中腰部 KOL/KOC 合作，月度 200 条社媒内容全平台覆盖。' },
            { num: '3', phase: '第 1 个月起', title: 'PR 软文 + AI 推荐优化', desc: 'Stuff / NZ Herald / Viva 等主流媒体投放，医学专家署名论证文章提升 AI 训练源权重，建立 AI Visibility 监控仪表盘追踪引用率。12个月内 AI 推荐率目标 50%+。' },
          ].map((step) => (
            <div key={step.num} style={{ display: 'flex', gap: '20px', marginBottom: '20px', position: 'relative' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#1a4d3e',
                color: 'white',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}>
                {step.num}
              </div>
              <div style={{ paddingTop: '6px' }}>
                <div style={{
                  display: 'inline-block',
                  background: '#e8f4f0',
                  color: '#1a4d3e',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  marginBottom: '6px',
                }}>
                  {step.phase}
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f2922', marginBottom: '4px' }}>{step.title}</h4>
                <p style={{ fontSize: '12.5px', color: '#5a7a8a', margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 服务详情 */}
      <Section num="03" label="服务详情">
        <h2>我们具体做什么</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '24px' }}>
          {[
            { icon: '🌐', title: '官网重建', items: ['现代化网站架构重建', 'SEO 基础架构搭建', '中英双语完整优化', 'Core Web Vitals 达标', 'Schema 标记实现', '移动端全面适配', '科研内容展示体系'] },
            { icon: '🔍', title: 'SEO 与品牌占位', items: ['Google/Bing/Apple 认领', 'Wikipedia 品牌建档', '20 篇 SEO 优化页/月', '200+ 关键词排名追踪', 'Reddit / Quora 高权重源', '内链与外链策略', '每月排名报告'] },
            { icon: '📱', title: '社媒与 PR', items: ['IG/FB/TikTok/LinkedIn', '小红书/抖音本地化', '200 条内容/月', 'KOL/KOC 合作投放', '主流媒体 PR 软文', '社区运营与互动', '月度数据分析'] },
          ].map((svc) => (
            <div key={svc.title} style={{
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #d0dfe0',
              padding: '24px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #1a4d3e, #d4af8f)',
              }} />
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{svc.icon}</div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f2922', marginBottom: '10px' }}>{svc.title}</h4>
              <ul style={{ listStyle: 'none' }}>
                {svc.items.map((item) => (
                  <li key={item} style={{
                    fontSize: '12px',
                    color: '#5a7a8a',
                    padding: '4px 0',
                    borderBottom: '1px solid #eef5f8',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                  }}>
                    <span style={{ color: '#1a4d3e', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 04 三大战场 */}
      <Section num="04" label="三大曝光战场" bgLight>
        <h2>品类 Top 3 的三维覆盖</h2>
        <p>品牌心智占有率 = 搜索排名 × 社媒记忆 × AI 推荐。三个战场缺一，就失去 1/3 的市场机会。</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '24px' }}>
          {[
            { title: '🔍 Google 自然搜索', desc: '决定「被搜到」——58% 消费者在线寻找高端补剂的第一步是谷歌搜索。占据品类词Top5 = 每月 2,000–4,000 免费流量。' },
            { title: '📱 社媒矩阵', desc: '决定「被记住」——品牌心智建立的主阵地。每月 200 条内容覆盖 5 个平台，15K+ 粉丝基础，建立社区信任度。' },
            { title: '🤖 AI Visibility', desc: '决定「被推荐」——2026 年 30% 购买决策起点在 AI。AI 推荐率从 0% → 50%+，相当于新增一个自动转化渠道。' },
          ].map((item) => (
            <div key={item.title} style={{
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #d0dfe0',
              padding: '20px',
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1a4d3e', marginBottom: '12px' }}>{item.title}</h4>
              <p style={{ fontSize: '12.5px', color: '#5a7a8a', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 05 竞品分析 */}
      <Section num="05" label="竞品分析">
        <h2>市场机会：竞争对手的数字化短板</h2>
        <p>NZ 高端脂质体市场整体数字化程度仍低，先动者优势显著。以下对标分析显示 R&B 的突破空间：</p>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
          fontSize: '12.5px',
        }}>
          <thead>
            <tr style={{ background: '#0f2922', color: 'white' }}>
              {['竞争对手', 'Google 排名', '社媒布局', 'PR 内容', 'AI 引用率', '小红书'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['ProNordic', 'Top 3', 'IG 活跃', '一般', '中等', '无'],
              ['LIPO-SACHETS', 'Top 10', 'TikTok 强', '偶发', '中低', '无'],
              ['Cellular Medicines', 'Top 5', '基础', '有', '中等', '无'],
              ['LivOn Labs', 'Top 8', 'LinkedIn', '无', '低', '无'],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 1 ? '#f5fafc' : 'white' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: '11px 16px',
                    borderBottom: '1px solid #e0ecf2',
                    color: '#1a2e3b',
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            <tr style={{ background: '#e5f6ff' }}>
              <td style={{ padding: '11px 16px', fontWeight: 600, color: '#0f2922' }}>🚀 Reborn Biotech（合作后）</td>
              <td style={{ padding: '11px 16px', fontWeight: 600, color: '#0f2922' }}>Top 3</td>
              <td style={{ padding: '11px 16px', color: '#1a9950', fontWeight: 700 }}>全平台</td>
              <td style={{ padding: '11px 16px', color: '#1a9950', fontWeight: 700 }}>系统化</td>
              <td style={{ padding: '11px 16px', color: '#1a9950', fontWeight: 700 }}>50%+</td>
              <td style={{ padding: '11px 16px', color: '#1a9950', fontWeight: 700 }}>首家</td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* 06 KPI 预期 */}
      <Section num="06" label="6 / 12 个月预期成果" bgLight>
        <h2>可量化、可追踪、可问责</h2>
        <p>所有 KPI 都将通过 Google Search Console、社媒后台、AI 监控工具实时追踪，每月透明汇报。</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '24px' }}>
          {[
            { title: '6 个月目标', items: [
              ['Google 品牌占位', '8/10'],
              ['品类词排名', 'Top 15'],
              ['月搜索流量', '2K–4K'],
              ['AI 推荐率', '20–30%'],
              ['社媒粉丝', '3K–6K'],
              ['PR 媒体', '3–5 篇'],
            ] },
            { title: '12 个月目标', items: [
              ['Google 品牌占位', '10/10'],
              ['品类词排名', 'Top 5'],
              ['月搜索流量', '8K–15K'],
              ['AI 推荐率', '50%+'],
              ['社媒粉丝', '15K+'],
              ['PR 媒体', '10+ 篇'],
            ] },
            { title: '小红书（新战场）', items: [
              ['笔记数量', '100+ / 6M'],
              ['粉丝增长', '5K+ / 12M'],
              ['抖音视频', '50+ / 12M'],
              ['引流转化', '系统追踪'],
              ['中文市场', '全覆盖'],
              ['多语支持', '4 语本化'],
            ] },
          ].map((card) => (
            <div key={card.title} style={{
              background: 'white',
              borderRadius: '10px',
              border: '1px solid #d0dfe0',
              padding: '20px',
            }}>
              <h4 style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#1a4d3e',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {card.title}
              </h4>
              {card.items.map(([label, val]) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  padding: '6px 0',
                  borderBottom: '1px solid #eef5f8',
                  color: '#1a2e3b',
                }}>
                  <span>{label}</span>
                  <span style={{ fontWeight: 700, color: '#1a4d3e' }}>{val}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* 07 定价 */}
      <Section num="07" label="合作定价">
        <h2>专属报价方案</h2>
        <p>以下为针对 Reborn Biotech 定制的战略合作价格。我们建议从<strong>试点方案（3个月）</strong>开始验证，随后扩展至 12 个月完整计划。</p>

        <div style={{
          background: 'linear-gradient(135deg, #0f2922, #1a4d3e)',
          color: 'white',
          borderRadius: '12px',
          padding: '36px 40px',
          marginBottom: '20px',
          marginTop: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            right: '30px',
            bottom: '-10px',
            width: '150px',
            height: '150px',
            opacity: 0.1,
            fontSize: '120px',
          }}>
            💊
          </div>

          <div style={{
            display: 'inline-block',
            background: '#d4af8f',
            color: '#0f2922',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '4px',
            marginBottom: '20px',
            letterSpacing: '1px',
          }}>
            🎁 限时福利 · Foundation 启动包 FREE!
          </div>

          <div style={{
            border: '2px solid rgba(212, 175, 143, 0.6)',
            borderRadius: '8px',
            padding: '16px 12px',
            marginBottom: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', color: '#f4d4a8', fontWeight: 700 }}>
                一次性官网重建 + 社媒搭建（免费赠送）
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginTop: '8px', lineHeight: 1.6 }}>
                ✓ 官网 SEO 架构 + Wikipedia / Google Business 认领 + 5 社媒账号完整建档<br />
                ✓ 基础投流设置（Google Ads / Meta Ads 初始配置）<br />
                ✓ 社媒自动化软件（Buffer / Later 集成管理）<br />
                ✓ 内容管理自动化软件（Zapier / Make 工作流搭建）<br />
                <em style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>* SEO 排名监控需客户自行支付约 NZD $1,000，推荐第 1 个月启用</em>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 700 }}>FREE</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>价值 $18K–28K</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px', marginTop: '12px' }}>
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>月度 Growth 服务（推荐）</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>20 页/月 SEO + 200 条/月社媒 + KOL 投放 + PR + 月度报告</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>按需定制 / 月 · ≥6 个月</div>
            </div>

            <div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>12 个月旗舰包（出海级）</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>含 4 语本地化、小红书/抖音、展会支持、临床数据 AI 优化</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>按需定制 / 月 · 品类 Top 3 保证</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: '超出内容条数', price: '$15 / 条' },
            { label: 'Google Ads / Meta Ads 投放', price: '成本 + 15% 管理费' },
          ].map((item) => (
            <div key={item.label} style={{
              background: 'white',
              border: '1px solid #d0dfe0',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '13px', color: '#5a7a8a' }}>{item.label}</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f2922' }}>{item.price}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 08 投资回报 */}
      <Section num="08" label="投资回报" bgLight>
        <h2>每月 NZD $6,500，需要多少销额回本？</h2>
        <p>假设 R&B 单瓶均价 NZD $30–50，毛利率 40–50%：</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
          {[
            { title: '✅ 保守情景', items: ['月服务费：$6,500', '单瓶均价：$40 (含税)', '毛利 45%：$18/瓶', '回本需销量：≈360瓶/月', '行业经验数据：成熟后月销 500–1,200 瓶'] },
            { title: '✅ 12 个月复利', items: ['M1–3：见效期（铺基础）', 'M4–6：加速期（流量爆发）', 'M7–12：收获期（自然流量 + AI 推荐）', 'ROI：3–5 倍（保守估计）'] },
          ].map((item) => (
            <div key={item.title} style={{
              background: 'white',
              border: '1px solid #d0dfe0',
              borderLeft: '4px solid #1a9950',
              borderRadius: '8px',
              padding: '20px',
            }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f2922', marginBottom: '12px' }}>{item.title}</h4>
              {item.items.map((line) => (
                <p key={line} style={{ fontSize: '12.5px', color: '#5a7a8a', margin: '4px 0' }}>{line}</p>
              ))}
            </div>
          ))}
        </div>

        <p style={{ marginTop: '16px', fontSize: '12.5px', color: '#5a7a8a' }}>
          💡 关键点：SEO 和社媒有复利效应。第 6 个月后通常可见自然流量指数增长，无需额外投入即可产生持续销售。数字基建是<strong>永续资产</strong>。
        </p>
      </Section>

      {/* 09 启动节奏 */}
      <Section num="09" label="启动节奏">
        <h2>确认合作后，我们立刻开始</h2>

        <div style={{ marginTop: '20px' }}>
          {[
            { step: 1, title: '签订合作协议（Day 1）', desc: '确认服务范围、KPI、付款条款（建议首月预付建站费+月费）' },
            { step: 2, title: '启动会议（Day 2）', desc: '品牌素材交接、关键词研究、社媒账号授权、竞品深度分析' },
            { step: 3, title: '官网首稿（Day 7）', desc: '提交首页设计稿、确认视觉风格、开始内容架构搭建' },
            { step: 4, title: '官网上线（Day 35）', desc: '完成所有页面、SEO 架构验证、Google Search Console 绑定' },
            { step: 5, title: '全面启动（Day 36）', desc: 'SEO 内容发布、社媒日常运营、KOL 投放、PR 软文、AI 监控系统上线' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: '#1a4d3e',
                color: 'white',
                borderRadius: '50%',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {item.step}
              </div>
              <div style={{ paddingTop: '3px' }}>
                <p style={{ margin: 0, fontSize: '13.5px' }}><strong style={{ color: '#0f2922' }}>{item.title}</strong></p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#5a7a8a' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <div style={{
        background: '#0f2922',
        color: 'rgba(255,255,255,0.5)',
        padding: '36px 60px',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <strong style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Magic Lab</strong><br />
          新西兰华人品牌数字化增长服务 · 20 国出海支持
        </div>
        <div style={{ textAlign: 'right' }}>
          本提案有效期 30 天<br />
          联系：contact@magiclab.com | magiclab.com
        </div>
      </div>
    </div>
  );
}

function Section({ num, label, children, bgLight }: { num: string; label: string; children: React.ReactNode; bgLight?: boolean }) {
  return (
    <section style={{
      padding: '56px 60px',
      background: bgLight ? '#f5f9f8' : 'white',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '11px',
        letterSpacing: '3px',
        color: '#1a4d3e',
        fontWeight: 700,
        marginBottom: '10px',
        textTransform: 'uppercase',
      }}>
        <div style={{
          display: 'block',
          width: '24px',
          height: '2px',
          background: '#1a4d3e',
        }} />
        {num} · {label}
      </div>
      {children}
    </section>
  );
}
