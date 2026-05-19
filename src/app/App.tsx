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

function Upload(props: IconProps) {
  return (
    <svg {...iconAttrs(props)}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m12 10-4 4h8l-4-4Z" />
      <path d="M12 14V3" />
    </svg>
  );
}

function FileText(props: IconProps) {
  return (
    <svg {...iconAttrs(props)}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

const val = (data: Record<string, string>, key: string, fallback: string) =>
  (data[key] || "").trim() || fallback;

type Copy = { key: string; title: string; label: string; text: string };

function parseGeneratedSections(text: string) {
  const personaMarker = "【人设文案】";
  const businessMarker = "【业务文案】";
  const personaStart = text.indexOf(personaMarker);
  const businessStart = text.indexOf(businessMarker);

  if (personaStart === -1 && businessStart === -1) {
    return { persona: text, business: "" };
  }

  const persona =
    personaStart === -1
      ? ""
      : text
          .slice(
            personaStart + personaMarker.length,
            businessStart === -1 ? text.length : businessStart,
          )
          .trimStart();
  const business =
    businessStart === -1 ? "" : text.slice(businessStart + businessMarker.length).trimStart();

  return { persona, business };
}

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
    `我是${name}，一位${personality}的${position}。在这个领域深耕多年，最擅长${skill}。`,
    "我始终认为，真正的专业服务不在于话术有多华丽，而在于能否真正站在客户角度思考。",
    `我希望被记住为「${tag}」——一个值得托付、敢于担当的长期伙伴。`,
    "",
    "【我的价值观】",
    "真诚是最好的名片，专业是信任的基石，长期主义是我做事的准则。",
    "我相信，每一份信任都值得被认真对待，每一个家庭的未来都值得被用心守护。",
    "",
    "【我相信什么】",
    `${mission}。`,
    "不贩卖焦虑，不夸大收益，只把风险、路径和选择讲清楚。",
    "在信息泛滥的时代，我选择做那个敢说真话、愿意陪跑的人。",
    "",
    "【我经历过什么】",
    `我最骄傲的一件事是：${proud}。`,
    "这些年，我见证了太多家庭在关键决策时刻的迷茫与焦虑，也陪伴许多客户找到了适合自己的解决方案。",
    `也正因为${hurt}，我更相信专业服务的底层是责任，而不是成交。`,
    "这份经历让我明白，财富管理不是简单的产品推荐，而是关乎人生规划的长期陪伴。",
    familyInfluence ? `\n家庭里影响我最深的是：${familyInfluence}。这让我更加懂得责任与担当的意义。` : "",
    careerInfluence ? `\n事业上塑造我的是：${careerInfluence}。这段经历奠定了我专业服务的根基。` : "",
    "",
    "【我的承诺】",
    "不推销、不套路、不夸大，只提供客观专业的建议。",
    "无论您处于人生哪个阶段，我都会以同等的专业和真诚对待每一位客户。",
  ]
    .filter(Boolean)
    .join("\n");

  const business = [
    `${tag}`,
    "",
    "专注为高净值家庭提供全方位的资产规划与风险管理服务",
    "",
    "【主要服务】${product}",
    "从资产配置到风险保障，从教育规划到传承安排，提供一站式解决方案",
    "",
    "【适合人群】${customers}",
    "无论是正在积累财富的创富一代，还是希望家业长青的企业家家族，都能在这里找到适合的方案",
    "",
    "【覆盖城市】${cities}",
    "线上线下结合，无论您身处何处，都能享受专业贴心的服务",
    "",
    "【客单区间】${price}",
    "根据家庭实际情况定制方案，确保每一分投入都物超所值",
    "",
    "【核心能力】${skill}",
    "用专业的分析和丰富的经验，为您的财富保驾护航",
    "",
    "【我能帮你解决】",
    "1. 看不清方案差异，不知道该信谁 —— 帮您理清复杂信息，做出明智选择",
    "2. 信息太碎，无法判断长期风险 —— 提供系统化的风险评估与规划框架",
    "3. 想做配置，却缺少真正陪你落地的人 —— 全程陪伴，确保方案落地执行",
    "4. 担心服务断层，后续无人跟进 —— 建立长期服务关系，持续跟踪调整",
    "",
    "【为什么是我】",
    `我的差异化不是把方案包装得更复杂，而是${advantage}。`,
    "在这个信息爆炸的时代，我选择做那个愿意花时间倾听、用心理解您需求的人",
    "不追求短期成交，只关注长期价值，与您共同见证财富的稳健增长",
    "",
    "【我的服务理念】",
    "以客户需求为中心，以专业能力为支撑，以长期陪伴为承诺",
    "每一份方案都是量身定制，每一次服务都是用心交付",
    "",
    "【你将获得】",
    "- 一套更清晰的风险判断框架 —— 帮助您识别潜在风险，做出理性决策",
    "- 一份更匹配家庭阶段的配置思路 —— 根据您的实际情况，制定专属方案",
    "- 一个能长期陪跑、敢说真话的专业伙伴 —— 陪伴您走过人生每一个重要阶段",
    "- 持续的服务与跟进 —— 定期检视方案，根据情况动态调整",
    "",
    "【服务流程】",
    "1. 深度沟通：了解您的家庭状况、财务目标和风险偏好",
    "2. 需求分析：梳理您的核心需求，明确规划方向",
    "3. 方案定制：基于分析结果，制定个性化解决方案",
    "4. 落地执行：协助您完成各项配置，确保方案落地",
    "5. 持续服务：定期回访检视，根据情况调整优化",
    "",
    "选择我，您不仅获得一份方案，更收获一位值得信赖的长期伙伴",
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
  const [previewTab, setPreviewTab] = useState<string>("persona");
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const previewRef = useRef<HTMLElement | null>(null);

  const copies = useMemo(() => buildCopy(data), [data]);

  const getCopyText = (key: string) => {
    if (key in overrides) return overrides[key];
    return copies.find((c) => c.key === key)?.text ?? "";
  };

  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      1800,
    );
  };

  const regenerate = () => {
    setOverrides({});
  };

  const handleGenerate = async () => {
    if (!uploadedFile) {
      showToast("请先上传 Word 文档");
      return;
    }

    setIsProcessing(true);
    setPreviewTab("persona");
    setOverrides({ persona: "", business: "" });
    showToast("正在解析文档...");

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("/api/upload/stream", {
        method: "POST",
        body: formData,
      });

      if (!response.ok || !response.body) {
        const result = await response.json().catch(() => null);
        showToast(result?.detail || "生成失败");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let generatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);

          if (event.type === "status") {
            showToast(event.message);
          }

          if (event.type === "delta") {
            generatedText += event.content || "";
            const parsed = parseGeneratedSections(generatedText);
            setOverrides(parsed);
          }

          if (event.type === "done") {
            const personaText = event.data?.persona || "";
            const businessText = event.data?.business || "";

            if (personaText || businessText) {
              setData({
                name: uploadedFile.name.replace(/\.docx$/i, ""),
              });
              setOverrides({
                persona: personaText,
                business: businessText,
              });
              showToast(event.message || "文案已生成");
            } else {
              showToast("生成的文案内容为空");
            }
          }

          if (event.type === "error") {
            showToast(event.message || "生成失败");
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("网络错误，请稍后重试");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "docx") {
        setUploadedFile(file);
        showToast(`已选择文件: ${file.name}`);
      } else {
        showToast("请上传 .docx 格式的 Word 文档");
      }
    }
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

  const activePreview = copies.find((c) => c.key === previewTab) ?? copies[0];

  return (
    <div className="ip-app">
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar__brand">
            <div className="sidebar__logo">大鱼</div>
            <div>
              <div className="sidebar__title">IP 业务&人设文案生成器</div>
              <div className="sidebar__subtitle">海外 IP 陪跑@大鱼文化</div>
            </div>
          </div>

          <div className="upload-area">
            <div className="upload-area__title">上传 Word 文档</div>
            <div className="upload-area__desc">上传填写完成的「IP 塑造自审表」</div>
            
            <label className="upload-btn">
              <input
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                className="upload-btn__input"
              />
              <div className="upload-btn__inner">
                {uploadedFile ? (
                  <>
                    <FileText size={20} />
                    <div className="upload-btn__info">
                      <div className="upload-btn__name">{uploadedFile.name}</div>
                      <div className="upload-btn__size">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    <span>点击或拖拽上传</span>
                  </>
                )}
              </div>
            </label>

            <div className="upload-area__hint">
              支持 .docx 格式的 Word 文档
            </div>

            <button
              className="btn btn-primary btn-lg upload-area__generate-btn"
              type="button"
              onClick={handleGenerate}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={14} color="#ffffff" className="spin" /> 解析中...
                </>
              ) : (
                <>
                  <Sparkles size={14} color="#ffffff" /> 生成文案
                </>
              )}
            </button>
          </div>
        </aside>

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
                    <span className="preview__edited-badge">已编辑</span>
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
                placeholder="请先上传 Word 文档并点击生成按钮"
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
