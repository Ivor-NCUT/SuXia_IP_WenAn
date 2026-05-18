import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

type IconProps = {
  size?: number;
  strokeWidth?: number;
  color?: string;
};

function iconAttrs({ size = 16, strokeWidth = 2, color = "currentColor" }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function CheckCircle2(props: IconProps) {
  return (
    <svg {...iconAttrs(props)}>
      <path d="M21 11.1V12a9 9 0 1 1-5.3-8.2" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function Copy(props: IconProps) {
  return (
    <svg {...iconAttrs(props)}>
      <rect width="14" height="14" x="8" y="8" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function Download(props: IconProps) {
  return (
    <svg {...iconAttrs(props)}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function RefreshCw(props: IconProps) {
  return (
    <svg {...iconAttrs(props)}>
      <path d="M21 12a9 9 0 0 0-15.5-6.2L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 15.5 6.2L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function Sparkles(props: IconProps) {
  return (
    <svg {...iconAttrs(props)}>
      <path d="M12 3 9.8 8.8 4 11l5.8 2.2L12 19l2.2-5.8L20 11l-5.8-2.2Z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
      <path d="M19 17v4" />
      <path d="M17 19h4" />
    </svg>
  );
}

type FieldType = "input" | "textarea";
type Field = {
  id: string;
  label: string;
  type: FieldType;
  hint: string;
};
type Section = { id: string; title: string; description: string; fields: Field[] };

const sections: Section[] = [
  {
    id: "basic",
    title: "基础信息",
    description: "了解你这个人的基本面，这些会成为人设的底色",
    fields: [
      { id: "name", label: "姓名", type: "input", hint: "" },
      { id: "age", label: "年龄", type: "input", hint: "" },
      { id: "education", label: "学历", type: "input", hint: "" },
      { id: "personality", label: "性格", type: "input", hint: "" },
      { id: "hobbies", label: "兴趣爱好", type: "textarea", hint: "" },
      { id: "style", label: "穿衣风格与喜欢的品牌", type: "textarea", hint: "" },
      { id: "skill", label: "最擅长专业技能（个人）", type: "textarea", hint: "" },
      { id: "title", label: "头衔", type: "input", hint: "例：行业会长" },
      { id: "honor", label: "荣誉", type: "input", hint: "例:十佳设计师" },
      { id: "position", label: "职位", type: "input", hint: "例：品牌创始人 CEO" },
      {
        id: "experience",
        label: "个人 / 企业经历",
        type: "textarea",
        hint: "主要事件时间节点，例：2008 年毕业，2012 年辞职创业",
      },
    ],
  },
  {
    id: "business",
    title: "线下规模",
    description: "你正在经营什么生意，客户和定位是怎样的",
    fields: [
      {
        id: "advantage",
        label: "企业在行业中的优势与差异化",
        type: "textarea",
        hint: "我能提供什么独特价值？",
      },
      { id: "product", label: "公司主打产品", type: "input", hint: "" },
      { id: "price", label: "核心客单价区间", type: "input", hint: "" },
      { id: "cities", label: "分布主要城市", type: "input", hint: "" },
      {
        id: "customers",
        label: "目标客户与最大痛点",
        type: "textarea",
        hint: "谁是我的目标客户？他们最大的痛点是什么？",
      },
    ],
  },
  {
    id: "benchmark",
    title: "喜欢的博主与抖音/小红书账号",
    description: "下面各举例不少于 3 个账号（如：李子柒）",
    fields: [
      {
        id: "similarBrands",
        label: "对标的相似品牌",
        type: "textarea",
        hint: "至少 3 个",
      },
      {
        id: "industryAccounts",
        label: "对标同行业账号",
        type: "textarea",
        hint: "至少 3 个",
      },
      {
        id: "favoriteAccounts",
        label: "个人喜欢的账号",
        type: "textarea",
        hint: "至少 3 个",
      },
      {
        id: "benchmarkReason",
        label: "你觉得每个对标/喜欢账号你最想对标的部分",
        type: "textarea",
        hint:
          "例：我觉得他的简介很好；我觉得他的风格是我想要对标的",
      },
    ],
  },
  {
    id: "mission",
    title: "价值观 · 使命",
    description:
      "接下来请认真回顾过往人生，向内看自己，提炼出自身的闪光点。它可以是外界给你的定义，也可以是自我的认知——用真实穿透短视频赛道",
    fields: [
      {
        id: "mission",
        label: "我能为其他人贡献的价值是什么？我能解决什么问题？凭什么是我？",
        type: "textarea",
        hint: "",
      },
      {
        id: "memoryTag",
        label: "我希望被记住的标签是什么",
        type: "input",
        hint: "",
      },
    ],
  },
  {
    id: "lifeline",
    title: "绘制你的生命线高低潮",
    description:
      "回想你生活中出现过的高潮与低潮事件，按时间线罗列 10-20 条。可涉及工作、社交、情感、爱好、学习等；可以是好事或坏事，但都是你清晰记得、带来强烈感受的重大事件",
    fields: [
      {
        id: "lifeline",
        label: "高低潮事件清单",
        type: "textarea",
        hint:
          "示例：\n2001 年，我考上了清华\n2002 年，xxxx\n2004 年，xxxx（高潮事件）\nxxxx 年，xxxx（低谷事件）",
      },
    ],
  },
  {
    id: "review",
    title: "你人生中重要的回顾",
    description: "真实的经历最有穿透力，把决定你的瞬间写下来",
    fields: [
      {
        id: "proud",
        label: "人生中，哪一件事最让我骄傲？值得跟别人吹一辈子？",
        type: "textarea",
        hint: "",
      },
      {
        id: "impressive",
        label: "回顾过去，哪一件事情让我印象深刻？",
        type: "textarea",
        hint: "",
      },
      {
        id: "hurt",
        label: "你有没有经历过背叛、伤害、委屈？是什么事情？",
        type: "textarea",
        hint: "",
      },
      {
        id: "familyInfluence",
        label: "家庭中给你带来重要影响的人是谁？为什么？",
        type: "textarea",
        hint: "",
      },
      {
        id: "careerInfluence",
        label: "事业中给你带来重要影响的人是谁？为什么？",
        type: "textarea",
        hint: "",
      },
    ],
  },
];

const storageKey = "ip-copywriting-workbench:v2";
const totalFields = sections.reduce((s, sec) => s + sec.fields.length, 0);

const val = (data: Record<string, string>, key: string, fallback: string) =>
  (data[key] || "").trim() || fallback;

function splitList(text: string) {
  return (text || "")
    .split(/\n|、|,|，|;|；/)
    .map((i) => i.trim())
    .filter(Boolean)
    .slice(0, 5);
}

type Copy = { key: string; title: string; label: string; text: string };

function buildCopy(data: Record<string, string>): Copy[] {
  const name = val(data, "name", "你");
  const title = val(data, "title", "专业顾问");
  const position = val(data, "position", "品牌主理人");
  const personality = val(data, "personality", "真诚、果断、细致");
  const honor = val(data, "honor", "");
  const tag = val(data, "memoryTag", "值得信任的高客资产规划伙伴");
  const product = val(data, "product", "高客咨询服务");
  const customers = val(data, "customers", "正在寻找长期确定性方案的高净值客户");
  const advantage = val(data, "advantage", "把复杂方案讲清楚，并给客户持续陪跑");
  const mission = val(data, "mission", "帮助客户识别风险、配置资源、做出更稳的长期选择");
  const skill = val(data, "skill", "专业判断与方案落地");
  const cities = val(data, "cities", "核心城市");
  const price = val(data, "price", "高客定制");
  const proud = val(data, "proud", "长期陪客户解决关键问题");
  const hurt = val(data, "hurt", "经历过重要挑战后，更理解信任与责任的重量");
  const familyInfluence = val(data, "familyInfluence", "");
  const careerInfluence = val(data, "careerInfluence", "");

  const persona = [
    `${name}｜${tag}`,
    `${title}${honor ? " · " + honor : ""} / ${position}`,
    "",
    "【我是谁】",
    `我是${name}，${personality}的${position}。最擅长${skill}，希望被记住为「${tag}」。`,
    "",
    "【我相信什么】",
    `${mission}。不贩卖焦虑，只把风险、路径和选择讲清楚。`,
    "",
    "【我经历过什么】",
    `我最骄傲的一件事是：${proud}。`,
    `也正因为${hurt}，我更相信专业服务的底层是责任，而不是成交。`,
    familyInfluence ? `家庭里影响我最深的是：${familyInfluence}。` : "",
    careerInfluence ? `事业上塑造我的是：${careerInfluence}。` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const business = [
    `${tag}`,
    "",
    `【主要服务】${product}`,
    `【适合人群】${customers}`,
    `【覆盖城市】${cities}`,
    `【客单区间】${price}`,
    `【核心能力】${skill}`,
    "",
    "【我能帮你解决】",
    "1. 看不清方案差异，不知道该信谁",
    "2. 信息太碎，无法判断长期风险",
    "3. 想做配置，却缺少真正陪你落地的人",
    "",
    "【为什么是我】",
    `我的差异化不是把方案包装得更复杂，而是${advantage}。`,
    "",
    "【你将获得】",
    "- 一套更清晰的风险判断框架",
    "- 一份更匹配家庭阶段的配置思路",
    "- 一个能长期陪跑、敢说真话的专业伙伴",
  ].join("\n");

  return [
    {
      key: "persona",
      title: "人设文案",
      label: "主页 / 自我介绍",
      text: persona,
    },
    {
      key: "business",
      title: "业务文案",
      label: "服务 / 长图主文",
      text: business,
    },
  ];
}

export default function App() {
  const [data, setData] = useState<Record<string, string>>({});
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [previewTab, setPreviewTab] = useState<string>("persona");
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });
  const toastTimer = useRef<number | null>(null);
  const restoredRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.form) setData(draft.form);
        if (draft.overrides) setOverrides(draft.overrides);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
    restoredRef.current = true;
  }, []);

  const copies = useMemo(() => buildCopy(data), [data]);

  useEffect(() => {
    if (!restoredRef.current) return;
    localStorage.setItem(storageKey, JSON.stringify({ form: data, overrides }));
  }, [data, overrides]);

  const getCopyText = (key: string) => {
    if (key in overrides) return overrides[key];
    return copies.find((c) => c.key === key)?.text ?? "";
  };

  const filledCount = Object.values(data).filter((v) => (v || "").trim()).length;
  const percent = Math.round((filledCount / totalFields) * 100);

  const sectionStats = sections.map((s) => {
    const filled = s.fields.filter((f) => (data[f.id] || "").trim()).length;
    return { id: s.id, total: s.fields.length, filled };
  });

  // scroll-spy — observe section visibility regardless of which element scrolls
  useEffect(() => {
    const root = scrollRef.current;
    const elements = sections
      .map((s) => document.getElementById(`section-${s.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = visible[0].target.id.replace(/^section-/, "");
          setActiveSection(id);
        }
      },
      {
        root: root ?? null,
        rootMargin: "-80px 0px -65% 0px",
        threshold: [0, 0.01, 0.5, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      1800,
    );
  };

  const handleField = (id: string, v: string) => setData((d) => ({ ...d, [id]: v }));

  const regenerate = () => {
    setOverrides({});
  };

  const scrollWindowToElement = (el: HTMLElement, block: "start" | "center" = "start") => {
    const rect = el.getBoundingClientRect();
    const offset =
      block === "center"
        ? rect.top + window.scrollY - (window.innerHeight - rect.height) / 2
        : rect.top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
  };

  const handleGenerate = () => {
    regenerate();
    showToast("文案已生成");

    if (window.matchMedia("(max-width: 1080px)").matches) {
      window.setTimeout(() => {
        if (previewRef.current) scrollWindowToElement(previewRef.current);
      }, 80);
    }
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const target = document.getElementById(`section-${id}`);
    if (!target) return;

    if (scrollRef.current && window.matchMedia("(min-width: 1081px)").matches) {
      const container = scrollRef.current;
      container.scrollTo({
        top: target.offsetTop - container.offsetTop - 24,
        behavior: "smooth",
      });
      return;
    }

    scrollWindowToElement(target);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCopyText(previewTab));
    } catch {
      /* noop */
    }
    showToast("已复制到剪贴板");
  };

  const handleDownload = () => {
    const blob = new Blob([getCopyText(previewTab)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = (data.name || "IP 文案").trim();
    link.href = url;
    link.download = `${fileName}-IP文案.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  let qIndex = 0;
  const activePreview = copies.find((c) => c.key === previewTab) ?? copies[0];

  return (
    <div className="ip-app">
      <div className="app-shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar__brand">
            <div className="sidebar__logo">大鱼</div>
            <div>
              <div className="sidebar__title">IP 塑造自审表</div>
              <div className="sidebar__subtitle">【大鱼】专属工作台</div>
            </div>
          </div>

          <div className="sidebar__progress">
            <div className="sidebar__progress-label">
              <span>填写进度</span>
              <span>{percent}%</span>
            </div>
            <div className="sidebar__progress-bar">
              <i style={{ width: `${percent}%` }} />
            </div>
          </div>

          <nav className="sidebar__nav">
            <div className="sidebar__nav-title">问卷分区</div>
            {sections.map((s, i) => {
              const stat = sectionStats[i];
              const complete = stat.filled === stat.total && stat.total > 0;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`nav-item ${activeSection === s.id ? "is-active" : ""} ${
                    complete ? "is-complete" : ""
                  }`}
                  onClick={() => scrollTo(s.id)}
                >
                  <span className="nav-item__num">
                    {complete ? <CheckCircle2 size={14} strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span>{s.title}</span>
                  <span className="nav-item__count">
                    {stat.filled}/{stat.total}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="main">
          <header className="topbar">
            <div className="topbar__title">
              <h1>【大鱼】IP 塑造自审表</h1>
              <small>完成后将自动生成人设文案与业务文案</small>
            </div>
            <div className="topbar__actions">
              <span className="save-status">草稿已自动保存</span>
            </div>
          </header>

          <div className="scroll-area" ref={scrollRef}>
            <div className="form-container">
              <div className="form-hero">
                <span className="form-hero__tag">Practical Plan · 自审问卷</span>
                <h2>【大鱼】IP 塑造自审表</h2>
                <p>
                  全部 {totalFields} 题，平均 12 分钟完成。建议按顺序填写；
                  完成后，右侧会生成人设文案与业务文案。
                </p>
              </div>

              {sections.map((section, sIdx) => (
                <section
                  key={section.id}
                  id={`section-${section.id}`}
                  className="section-block"
                >
                  <div className="section-heading">
                    <div className="section-heading__num">{sIdx + 1}</div>
                    <div className="section-heading__copy">
                      <div className="section-heading__title">{section.title}</div>
                      <div className="section-heading__desc">{section.description}</div>
                    </div>
                    <div className="section-heading__count">
                      {sectionStats[sIdx].filled} / {sectionStats[sIdx].total}
                    </div>
                  </div>

                  {(() => {
                    const renderField = (f: Field) => {
                      qIndex += 1;
                      const value = data[f.id] || "";
                      return (
                        <div key={f.id} className="question">
                          <label className="question__label" htmlFor={f.id}>
                            <span className="question__index">{qIndex}.</span>
                            <span>{f.label}</span>
                          </label>
                          {f.hint && <div className="question__hint">{f.hint}</div>}
                          {f.type === "textarea" ? (
                            <textarea
                              id={f.id}
                              className="textarea"
                              placeholder="请输入内容"
                              value={value}
                              onChange={(e) => handleField(f.id, e.target.value)}
                            />
                          ) : (
                            <input
                              id={f.id}
                              type="text"
                              className="input"
                              placeholder="请输入内容"
                              value={value}
                              onChange={(e) => handleField(f.id, e.target.value)}
                            />
                          )}
                          {f.type === "textarea" && (
                            <div className="char-count">{value.length} 字</div>
                          )}
                        </div>
                      );
                    };

                    if (section.id === "basic") {
                      const head = section.fields.slice(0, 4);
                      const rest = section.fields.slice(4);
                      return (
                        <>
                          <div className="question-grid">
                            {head.map(renderField)}
                          </div>
                          {rest.map(renderField)}
                        </>
                      );
                    }

                    return section.fields.map(renderField);
                  })()}
                </section>
              ))}
            </div>
          </div>

          <div className="form-footer">
            <div className="form-footer__inner">
              <div className="form-footer__hint">
                已填写 <strong>{filledCount}</strong> / {totalFields} 题 · 草稿仅保存在本地浏览器
              </div>
              <div className="form-footer__actions">
                <button
                  className="btn btn-secondary btn-lg"
                  type="button"
                  onClick={regenerate}
                >
                  <RefreshCw size={14} /> 重新生成
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  type="button"
                  onClick={handleGenerate}
                >
                  <Sparkles size={14} color="#ffffff" /> 生成文案
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Preview */}
        <aside className="preview" ref={previewRef}>
          <div className="preview__head">
            <div className="preview__head-title">
              <strong>生成文案</strong>
              <span>切换查看不同版本</span>
            </div>
          </div>

          <div className="preview__tabs">
            {copies.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`preview__tab ${previewTab === c.key ? "is-active" : ""}`}
                onClick={() => setPreviewTab(c.key)}
              >
                {c.title}
              </button>
            ))}
          </div>

          <div className="preview__body">
            <div className="preview__card">
              <div className="preview__card-meta">
                <div>
                  <strong>{activePreview.title}</strong>
                  <span className="preview__card-label">{activePreview.label}</span>
                </div>
                  <div className="preview__card-tools">
                  {previewTab in overrides && (
                    <span className="preview__edited-badge">
                      已编辑
                    </span>
                  )}
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={handleDownload}
                    title="导出当前文案"
                  >
                    <Download size={13} /> 导出
                  </button>
                </div>
              </div>
              <textarea
                key={previewTab}
                className="preview__inline-editor"
                spellCheck={false}
                placeholder="点击此处直接编辑文案"
                value={getCopyText(previewTab)}
                onChange={(e) =>
                  setOverrides((o) => ({ ...o, [previewTab]: e.target.value }))
                }
              />
              <div className="preview__card-actions">
                <button
                  className="btn btn-icon"
                  type="button"
                  title="重新生成"
                  onClick={regenerate}
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  className="btn btn-icon"
                  type="button"
                  title="复制"
                  onClick={handleCopy}
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className={`toast ${toast.visible ? "is-visible" : ""}`} role="status" aria-live="polite">
        {toast.msg}
      </div>
    </div>
  );
}
