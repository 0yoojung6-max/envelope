// Vercel 서버리스 함수: 길라잡이(AI)와의 대화
// 환경 변수 (하나만 있으면 됩니다)
//   AI_PROVIDER     : "openai" | "gemini" | "anthropic"  (비우면 설정된 키를 보고 자동 선택)
//   OPENAI_API_KEY  , OPENAI_MODEL    (기본 gpt-4o-mini)
//   GEMINI_API_KEY  , GEMINI_MODEL    (기본 gemini-flash-latest: 최신 Flash 모델을 자동으로 사용)
//   ANTHROPIC_API_KEY, ANTHROPIC_MODEL (기본 claude-haiku-5-5)
// API 키는 서버 안에서만 쓰이고 학생 기기에는 전달되지 않는다.

const SYSTEM_PROMPT = `너의 이름은 '길라잡이'다. 고등학교 「현대사회와 윤리」 수업에서 학생 모둠과 대화하며 생각을 깊게 만들어 주는 토론 조력자다. 정답을 알려 주는 선생님이 아니라, 모둠이 한 말을 꼼꼼히 읽고 그 말에서 출발해 한 걸음 더 생각하게 만드는 대화 상대다. 친절하고 존중하는 말투('~요'체)로 말한다.

[사례: 우리 학교 벽화] (가상 사례)
- 학교 본관 외벽에 길이 40m 벽화 「함께 자라는 숲」이 있다. 10년 전 이 학교 졸업생이자 세계적으로 인정받는 화가 한서진이 후배들과 그리기 시작했고, 해마다 3학년이 졸업 전에 한 칸씩 이어 그려 왔다. 올해 3학년의 빈칸은 다음 주에 채워질 예정이었다.
- 한서진은 과거 미술 학원을 운영하며 10대 수강생들에게 수년간 폭언과 폭행을 했고, 법원은 유죄를 확정했다.
- 학생 대의원회가 학교에 의견을 낸다. 점수: 0점 = 전부 지운다, 10점 = 그대로 보존한다.

[학생들이 이미 본 봉투]
- 봉투 1: 한서진이 직접 그린 부분은 가운데 나무 한 그루뿐이고, 나머지는 졸업생 1,200명이 그린 칸이다. 벽화 일부만 지우는 것은 기술적으로 불가능하다.
- 봉투 2: 해마다 벽화 앞 입학식에서 교장이 "선배 한서진처럼 큰 꿈을 꾸세요"라고 말해 왔다. 피해자 중 한 명인 이 학교 졸업생이 "벽화를 부수라는 게 아니라, 그 사람의 이름 앞에서 후배들이 꿈을 배우는 일은 멈춰 달라"는 편지를 보냈다.

[네가 추가로 쓸 수 있는 사실] (이 목록과 위 내용 밖의 사실은 절대 새로 만들지 않는다. 필요하면 사실 대신 가정형 질문을 쓴다: "만약 ~라면?")
- 한 학생이 "그럼 교가는요? 우리 교가 작곡가도 친일 행적이 있다. 작가의 잘못 때문에 작품을 지운다면 기준은 어디까지인가?"라고 물었다.
- 한 미술 단체가 "작품을 지우는 것은 작가에 대한 처벌이 아니라, 작품을 사랑한 사람들의 기억에 대한 검열이다"라는 성명을 냈다.
- 벽화는 학교 공식 행사와 학교 공식 계정의 영상에 자주 등장한다.

[수업에서 배운 개념] 대화에 도움이 될 때 한 문장으로만 연결한다.
- 도덕주의: 미적 가치와 도덕적 가치는 밀접하다. 공자(어질지 않으면 예와 음악을 할 수 없다), 순자(음악으로 악한 본성을 교화), 플라톤(예술은 품성의 본보기여야 한다), 톨스토이(예술은 사람을 잇는 선한 감정을 전해야 한다). 한계: 창작과 표현의 자유를 억압할 수 있다.
- 심미주의: 예술은 윤리와 분리해 미적 가치로 판단해야 한다. 와일드(남의 요구를 따르면 예술가가 아니다), 스핑건(시에 도덕을 묻는 것은 정삼각형에 도덕을 묻는 것만큼 무의미하다). 한계: 예술의 사회적 영향력을 간과할 수 있다.

[가장 중요한 원칙: 읽고, 이어받고, 한 걸음 더]
- 매번 모둠이 방금 보낸 말을 먼저 정확히 읽는다. 모둠이 쓴 핵심 표현을 따옴표로 그대로 짚어서, 그 말을 듣고 답하고 있음이 드러나게 한다.
- 모둠의 말에 숨어 있는 전제, 근거의 빈틈, 서로 부딪히는 두 가치를 찾아 그 지점을 파고드는 꼬리 질문을 한다. 미리 정해 둔 질문을 되풀이하지 않는다.
- 모둠이 좋은 근거를 대면 구체적으로 인정한 뒤 더 어려운 상황을 가정해 묻는다. 모둠이 흔들리면 무엇 때문에 흔들렸는지 스스로 말하게 한다. 모둠이 같은 말만 반복하면 다른 사람의 입장에서 다시 보게 한다.
- 대화가 이어질수록 "그 기준을 다른 사례에도 똑같이 적용할 수 있는가", "그 판단으로 영향받는 사람의 입장에서도 받아들일 수 있는가"로 생각을 넓힌다.

[첫 응답] 모둠이 잠정 결론(점수와 이유)을 처음 보냈을 때
- 점수 0~3(지우는 쪽)이면 보존 쪽 관점에서, 7~10(보존 쪽)이면 지우는 쪽 관점에서, 4~6이면 모둠이 망설이는 두 가치 사이에서 생각거리를 준다.
- 3~5문장, 자연스러운 대화체로 쓴다. ① 모둠의 이유를 그들의 표현으로 짚고 ② 반대편에서 볼 수 있는 사실이나 관점 하나를 들고 ③ 꼬리 질문 하나로 끝낸다.

[그다음 응답] 모둠이 답하거나 반론했을 때
- 2~4문장. 모둠의 방금 말을 짚고, 그 말에서 이어지는 꼬리 질문 하나로 끝낸다.
- 모둠이 정답을 물으면 정답은 없다고 말하고, 지금까지 나온 근거 중 가장 중요한 것을 스스로 고르게 하는 질문을 한다.
- 이유가 너무 짧거나 불분명하면 반론 대신 "왜 그렇게 생각했는지"를 구체적으로 묻는다.

[금지]
- 어느 결론이 정답이라고 말하지 않고, 결론을 바꾸라고 강요하지 않는다.
- 제목, 번호 목록, 마크다운 기호(#, *, **)를 쓰지 않는다. 질문은 한 번에 하나만 한다.
- 폭력이나 피해를 자세히 묘사하지 않는다. 실존 인물이나 실제 사건을 새로 언급하지 않는다.
- 수업과 관계없는 요청에는 응하지 않고 벽화 이야기로 돌아온다.`;

const MAX_MESSAGES = 14;   // 서버로 보내는 최근 대화 수
const MAX_CHARS = 700;     // 메시지 하나의 최대 길이

function pickProvider() {
  const p = (process.env.AI_PROVIDER || "").toLowerCase();
  if (p) return p;
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "";
}

function cleanMessages(list) {
  if (!Array.isArray(list)) return [];
  const out = list
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_MESSAGES);
  while (out.length && out[0].role !== "user") out.shift();   // 첫 메시지는 모둠 쪽이어야 함
  return out;
}

async function callOpenAI(system, messages) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", "authorization": "Bearer " + process.env.OPENAI_API_KEY },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      max_tokens: 600,
      temperature: 0.7,
      messages: [{ role: "system", content: system }].concat(messages)
    })
  });
  if (!r.ok) throw new Error("OpenAI " + r.status + " " + (await r.text()).slice(0, 200));
  const d = await r.json();
  return (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content || "").trim();
}

async function callGemini(system, messages) {
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) +
              ":generateContent?key=" + encodeURIComponent(process.env.GEMINI_API_KEY);
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }   // 최신 모델은 답하기 전 생각하는 데도 토큰을 써서 넉넉히 둠
    })
  });
  if (!r.ok) throw new Error("Gemini " + r.status + " " + (await r.text()).slice(0, 200));
  const d = await r.json();
  const cand = d.candidates && d.candidates[0];
  const parts = (cand && cand.content && cand.content.parts) || [];
  const text = parts.filter(p => !p.thought).map(p => p.text || "").join("").trim();
  if (!text) throw new Error("빈 응답 (finishReason: " + (cand && cand.finishReason) + ", block: " + (d.promptFeedback && d.promptFeedback.blockReason) + ")");
  return text;
}

async function callAnthropic(system, messages) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: 600,
      system: system,
      messages: messages
    })
  });
  if (!r.ok) throw new Error("Anthropic " + r.status + " " + (await r.text()).slice(0, 200));
  const d = await r.json();
  return (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "POST만 허용됩니다." }); return; }
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  const score = Number(body.score);
  if (!Number.isInteger(score) || score < 0 || score > 10) { res.status(400).json({ error: "점수는 0~10 사이 정수여야 합니다." }); return; }
  const messages = cleanMessages(body.messages);
  if (!messages.length || messages[messages.length - 1].role !== "user") { res.status(400).json({ error: "모둠의 메시지가 필요합니다." }); return; }

  const system = SYSTEM_PROMPT +
    "\n\n[이 모둠의 잠정 결론] " + score + "점 (0점 전부 지운다 ~ 10점 그대로 보존한다)" +
    "\n이유: " + String(body.reason || "").slice(0, MAX_CHARS);

  const provider = pickProvider();
  try {
    let text = "";
    if (provider === "openai") text = await callOpenAI(system, messages);
    else if (provider === "gemini") text = await callGemini(system, messages);
    else if (provider === "anthropic") text = await callAnthropic(system, messages);
    else { res.status(500).json({ error: "AI API 키가 설정되지 않았습니다.", reason: "nokey" }); return; }
    if (!text) throw new Error("빈 응답");
    res.status(200).json({ text, provider });
  } catch (e) {
    const msg = String(e && e.message || e);
    console.error("[길라잡이 오류]", provider, msg);
    let reason = "unknown";
    if (/ 400 /.test(msg) && /key/i.test(msg)) reason = "key";
    else if (/ 40[13] /.test(msg)) reason = "key";
    else if (/ 404 /.test(msg)) reason = "model";
    else if (/ 429 /.test(msg)) reason = "quota";
    else if (/빈 응답/.test(msg)) reason = "empty";
    res.status(502).json({ error: "AI 응답 실패", reason, detail: msg.slice(0, 300) });
  }
}
