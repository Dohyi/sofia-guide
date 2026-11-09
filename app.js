const pages = {
  home: '首页',
  history: '建筑历史',
  exterior: '外部结构',
  interior: '内部空间',
  compare: '历史对比',
  ar: 'AR探索'
};

const descriptions = {
  dome: [
    '中央穹顶',
    '观察穹顶的轮廓与基座，以及它和建筑主体的关系。此处将替换为经核验的构件介绍。'
  ],

  tower: [
    '钟楼',
    '观察塔体、开口与顶部的组合。此处将接入团队制作的局部模型与资料。'
  ],

  brick: [
    '红砖立面',
    '放大观察砖墙材质与拱形装饰。详细构造与历史信息待资料核验。'
  ]
};

// 건축 개념 도형
function church() {
  return `
    <svg
      class="art"
      viewBox="0 0 400 350"
      role="img"
      aria-label="圣索菲亚教堂概念示意，非实测模型"
    >
      <defs>
        <pattern
          id="brick"
          width="22"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <rect
            width="22"
            height="12"
            fill="#a6684d"
          />

          <path
            d="M0 0H22M0 12H22M11 0V12"
            stroke="#c48d6f"
            stroke-width="1"
          />
        </pattern>

        <pattern
          id="window"
          width="28"
          height="55"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M5 53V23Q14 0 23 23V53Z"
            fill="#474d43"
            stroke="#d5ae84"
            stroke-width="3"
          />
        </pattern>
      </defs>

      <ellipse
        cx="200"
        cy="332"
        rx="175"
        ry="10"
        fill="#34443222"
      />

      <g id="church-base">
        <path
          d="M65 324V212L104 168H286L335 215V324Z"
          fill="url(#brick)"
          stroke="#81523d"
        />

        <path
          d="M87 210L122 170H280L315 210"
          fill="#536856"
        />

        <rect
          x="149"
          y="156"
          width="104"
          height="168"
          fill="url(#brick)"
          stroke="#81523d"
        />

        <path
          d="M137 176L200 122L265 176Z"
          fill="#65735b"
        />

        <rect
          x="162"
          y="193"
          width="76"
          height="69"
          fill="url(#window)"
        />

        <path
          d="M176 324V285Q200 245 224 285V324"
          fill="#3b453b"
          stroke="#d3a779"
          stroke-width="7"
        />

        <rect
          x="81"
          y="229"
          width="53"
          height="62"
          fill="url(#window)"
        />

        <rect
          x="269"
          y="229"
          width="53"
          height="62"
          fill="url(#window)"
        />
      </g>

      <g id="church-dome">
        <rect
          x="163"
          y="107"
          width="74"
          height="66"
          fill="url(#brick)"
          stroke="#81523d"
        />

        <rect
          x="168"
          y="117"
          width="64"
          height="50"
          fill="url(#window)"
        />

        <path
          d="M154 108C126 76 185 58 200 29C216 59 273 76 246 108Z"
          fill="#536d5c"
          stroke="#344f40"
          stroke-width="3"
        />

        <path
          d="M200 15V35M191 23H209"
          stroke="#b49354"
          stroke-width="3"
        />
      </g>

      <g id="church-tower">
        <rect
          x="283"
          y="160"
          width="40"
          height="80"
          fill="url(#brick)"
        />

        <path
          d="M279 163L303 114L328 163Z"
          fill="#536d5c"
        />

        <path
          d="M303 100V119M297 106H309"
          stroke="#b49354"
          stroke-width="2"
        />

        <path
          d="M293 207V184Q303 165 313 184V207"
          fill="#3b453b"
        />
      </g>

      <g>
        <rect
          x="83"
          y="165"
          width="30"
          height="42"
          fill="url(#brick)"
        />

        <path
          d="M78 165Q78 147 98 128Q118 147 118 165Z"
          fill="#536d5c"
        />

        <path
          d="M98 113V133M92 120H104"
          stroke="#b49354"
          stroke-width="2"
        />
      </g>
    </svg>
  `;
}

const app = document.querySelector('#app');
const sheet = document.querySelector('#sheet');

let focusBefore;
let stream;

// 페이지 공통 제목
function title(id, sub) {
  return `
    <a class="back" href="#home">
      ← 返回首页
    </a>

    <div class="eyebrow">
      SOFIA / ${id.toUpperCase()}
    </div>

    <h1>${pages[id]}</h1>

    <p class="lede">${sub}</p>
  `;
}

// 설명 팝업 열기
function openDetail(key) {
  focusBefore = document.activeElement;

  const [t, p] = descriptions[key];

  document.querySelector('#sheet-title').textContent = t;
  document.querySelector('#sheet-text').textContent = p;

  sheet.hidden = false;

  document.body.classList.add('modal-open');
  document.querySelector('#close').focus();
}

// 설명 팝업 닫기
function closeDetail() {
  sheet.hidden = true;

  document.body.classList.remove('modal-open');

  focusBefore?.focus();
}

document.querySelector('#close').onclick = closeDetail;

sheet.onclick = (e) => {
  if (e.target === sheet) {
    closeDetail();
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDetail();
  }

  if (!sheet.hidden && e.key === 'Tab') {
    e.preventDefault();

    document.querySelector('#close').focus();
  }
});

// 메뉴 구성
document.querySelector('#navigation').innerHTML = Object.entries(pages)
  .map(([id, t]) => `
    <a href="#${id}">
      ${t} ↗
    </a>
  `)
  .join('');

document.querySelector('#menu').onclick = () => {
  const n = document.querySelector('#navigation');

  n.hidden = !n.hidden;

  document.querySelector('#menu').setAttribute(
    'aria-expanded',
    !n.hidden
  );
};

// 화면 렌더링
function render() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }

  closeDetail();

  document.querySelector('#navigation').hidden = true;

  document.querySelector('#menu').setAttribute(
    'aria-expanded',
    'false'
  );

  let id = location.hash.slice(1) || 'home';

  if (!pages[id]) {
    id = 'home';
  }

  // 1. 홈
  if (id === 'home') {
    app.innerHTML = `
      <div class="eyebrow">
        HARBIN · ARCHITECTURE GUIDE
      </div>

      <h1>
        走近索菲亚
        <br>
        读懂建筑的故事
      </h1>

      <p class="lede">
        从一块红砖，到穹顶之下。
        <br>
        用互动的方式，探索建筑的内外。
      </p>

      <div class="hero">
      <img
      class="hero-photo"
      src="images/sofia.jpg"
      alt="哈尔滨圣索菲亚教堂"
      >
    </div>

      <a class="primary" href="#ar">
        开始 AR 探索　↗
      </a>

      <a class="secondary" href="#exterior">
        先浏览建筑　→
      </a>

      <div class="section-label">
        四种方式，认识索菲亚
        <span>EXPLORE / 01—04</span>
      </div>

      <div class="grid">
        ${[
          ['history', '01', '沿着时间认识建筑'],
          ['exterior', '02', '查看建筑的组成'],
          ['interior', '03', '走进穹顶下的空间'],
          ['compare', '04', '发现过去与现在']
        ]
          .map(([k, n, s]) => `
            <a class="tile" href="#${k}">
              <b>${n}</b>
              <strong>${pages[k]} ↗</strong>
              <small>${s}</small>
            </a>
          `)
          .join('')}
      </div>
    `;
  }

  // 2. 건축 역사
  if (id === 'history') {
    app.innerHTML =
      title(id, '沿着时间，观察外观与空间用途的变化。') +
      `
        <div class="stage" style="filter: sepia(.7)">
          ${church()}
        </div>

        <div class="tabs" id="years">
          ${[1907, 1923, 1932, 1997]
            .map((y) => `
              <button
                data-year="${y}"
                aria-pressed="false"
              >
                ${y}
              </button>
            `)
            .join('')}
        </div>

        <div aria-live="polite">
          <div class="year" id="year"></div>
          <h2 id="event"></h2>
          <p id="history-copy"></p>
        </div>

        <div class="note">
          演示年表，正式内容与年份须由资料负责人核验。动画文件尚未接入。
        </div>
      `;

    const entries = {
      1907: [
        '早期教堂',
        '了解早期建筑形态，后续接入历史照片与资料。'
      ],

      1923: [
        '重建阶段',
        '通过资料和动画了解建筑重建过程。'
      ],

      1932: [
        '现存教堂建成',
        '观察现存建筑的整体形态与主要构件。'
      ],

      1997: [
        '保护与修复',
        '比较修复前后影像，认识建筑的保护与再利用。'
      ]
    };

    const set = (y) => {
      document.querySelector('#year').textContent = y;

      document.querySelector('#event').textContent =
        entries[y][0];

      document.querySelector('#history-copy').textContent =
        entries[y][1];

      document.querySelectorAll('[data-year]').forEach((b) => {
        b.classList.toggle(
          'active',
          b.dataset.year === String(y)
        );

        b.setAttribute(
          'aria-pressed',
          b.dataset.year === String(y)
        );
      });
    };

    document.querySelectorAll('[data-year]').forEach((b) => {
      b.onclick = () => set(b.dataset.year);
    });

    set(1932);
  }

  // 3. 외부 구조
  if (id === 'exterior') {
    app.innerHTML =
      title(id, '点击标记，发现构件与整体的关系。') +
      `
        <div class="stage">
          <span class="badge">
            交互示意 · 非真实3D
          </span>

          <div id="model">
            ${church()}
          </div>

          <button
            class="hotspot"
            style="top: 26%; left: 44%"
            data-detail="dome"
            aria-label="查看中央穹顶"
          >
            <span>穹顶</span>
          </button>

          <button
            class="hotspot"
            style="top: 48%; left: 72%"
            data-detail="tower"
            aria-label="查看钟楼"
          >
            <span>钟楼</span>
          </button>

          <button
            class="hotspot"
            style="top: 69%; left: 24%"
            data-detail="brick"
            aria-label="查看红砖立面"
          >
            <span>红砖</span>
          </button>
        </div>

        <div class="tools">
          <button id="zoom">放大</button>
          <button id="explode">分解示意</button>
          <button id="reset">复位</button>
        </div>

        <p class="note">
          当前使用SVG示意，支持缩放与部件分离演示。真实3D旋转需接入团队模型和3D查看器。
        </p>

        <a class="secondary" href="#interior">
          继续探索内部　→
        </a>
      `;

    let zoom = false;
    let exploded = false;

    const update = () => {
      document.querySelector('#model .art').style.transform =
        zoom ? 'scale(1.23)' : 'scale(1)';

      document.querySelector('#church-dome').style.transform =
        exploded ? 'translateY(-30px)' : '';

      document.querySelector('#church-tower').style.transform =
        exploded ? 'translateX(25px)' : '';

      document.querySelector('#zoom').classList.toggle(
        'active',
        zoom
      );

      document.querySelector('#explode').classList.toggle(
        'active',
        exploded
      );
    };

    document.querySelector('#zoom').onclick = () => {
      zoom = !zoom;
      update();
    };

    document.querySelector('#explode').onclick = () => {
      exploded = !exploded;
      update();
    };

    document.querySelector('#reset').onclick = () => {
      zoom = exploded = false;
      update();
    };
  }

  // 4. 내부 공간
  if (id === 'interior') {
    app.innerHTML =
      title(id, '从空间轮廓到采光，探索建筑内部。') +
      `
        <div class="tabs">
          <button class="active" id="current">
            当前空间
          </button>

          <button id="historic">
            历史复原说明
          </button>
        </div>

        <div class="interior">
          <div class="arch"></div>

          <button
            class="hotspot"
            style="top: 15%; left: 43%"
            data-detail="dome"
            aria-label="穹顶说明"
          ></button>
        </div>

        <div class="caption">
          通用空间概念示意，不代表实测内部
        </div>

        <div class="tools">
          <button id="cut">
            切换剖切示意
          </button>
        </div>

        <div class="card">
          <h2 id="inside-title">
            穹顶与采光
          </h2>

          <p id="inside-copy">
            此处预留室内模型、壁画热点与空间讲解。正式制作时替换为团队核验后的资料。
          </p>
        </div>
      `;

    document.querySelector('#cut').onclick = () => {
      document.querySelector('.interior').classList.toggle('cut');
    };

    document.querySelector('#historic').onclick = () => {
      document.querySelector('#inside-title').textContent =
        '历史复原须有依据';

      document.querySelector('#inside-copy').textContent =
        '只有具备历史照片或研究依据的陈设才进行复原，并明确标注为数字复原。当前没有接入历史复原模型。';

      document.querySelector('#historic').classList.add('active');
      document.querySelector('#current').classList.remove('active');
    };

    document.querySelector('#current').onclick = () => render();
  }

  // 5. 역사 비교
  if (id === 'compare') {
    app.innerHTML =
      title(id, '拖动分割线，体验影像对比。') +
      `
        <div class="compare" id="comparison">
          ${church()}

          <div class="old">
            ${church()}
          </div>

          <div class="divider"></div>
        </div>

        <div class="compare-labels">
          <span>左：复古色调示意</span>
          <span>右：原色示意</span>
        </div>

        <label for="slider">
          拖动查看对比
        </label>

        <input
          id="slider"
          type="range"
          min="0"
          max="100"
          value="50"
          aria-label="历史与现状对比位置"
        >

        <div class="note">
          目前是同一示意图的色调对比，不是真实历史变化。
          后续替换为同角度的历史照片与现状照片，并添加年份、来源。
        </div>
      `;

    document.querySelector('#slider').oninput = (e) => {
      document.querySelector('#comparison').style.setProperty(
        '--split',
        e.target.value + '%'
      );
    };
  }

  // 6. AR 탐색
  if (id === 'ar') {
    app.innerHTML =
      title(id, '先体验界面，再接入图像识别与3D内容。') +
      `
        <div class="stage">
          <span
            class="badge"
            id="ar-status"
            aria-live="polite"
          >
            AR界面演示 · 尚未识别
          </span>

          <div id="camera-view">
            ${church()}
          </div>

          <div class="scan-frame"></div>
        </div>

        <button class="primary" id="demo">
          使用示例 · 查看交互
        </button>

        <button class="secondary" id="camera">
          打开相机预览
        </button>

        <p
          class="note"
          id="camera-note"
          aria-live="polite"
        >
          相机仅用于本机预览，不上传或保存画面。
          此版本尚未接入图像识别SDK，不提供真实AR跟踪。
        </p>

        <div id="ar-links" hidden>
          <a class="secondary" href="#exterior">
            探索外部结构 →
          </a>

          <a class="secondary" href="#interior">
            探索内部空间 →
          </a>
        </div>
      `;

    document.querySelector('#demo').onclick = () => {
      document.querySelector('#ar-status').textContent =
        '示例模式 · 非真实识别';

      document.querySelector('#ar-links').hidden = false;
    };

    document.querySelector('#camera').onclick = async () => {
      const note = document.querySelector('#camera-note');

      if (!navigator.mediaDevices?.getUserMedia) {
        note.textContent =
          '当前环境无法使用相机，请使用HTTPS或localhost，并选择示例模式。';

        return;
      }

      try {
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
        }

        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment'
          },
          audio: false
        });

        if ((location.hash.slice(1) || 'home') !== 'ar') {
          s.getTracks().forEach((t) => t.stop());
          return;
        }

        stream = s;

        const v = document.createElement('video');

        v.autoplay = true;
        v.muted = true;
        v.playsInline = true;
        v.srcObject = s;

        document.querySelector('#camera-view').replaceChildren(v);

        note.textContent =
          '相机预览已开启。未进行建筑识别；离开页面将关闭相机。';
      } catch (e) {
        note.textContent =
          '无法打开相机，请检查浏览器权限，或使用示例模式。';
      }
    };
  }

  // 부위 설명 버튼 연결
  document.querySelectorAll('[data-detail]').forEach((b) => {
    b.onclick = () => openDetail(b.dataset.detail);
  });

  window.scrollTo(0, 0);
}

// 주소 변경 시 화면 전환
window.addEventListener('hashchange', render);

// 페이지를 떠날 때 카메라 종료
window.addEventListener('pagehide', () => {
  stream?.getTracks().forEach((t) => t.stop());
});

// 첫 화면 표시
render();