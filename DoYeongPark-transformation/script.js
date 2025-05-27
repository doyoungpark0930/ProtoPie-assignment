const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 🔴 원점2 객체 (회전 중심점)
const origin = {
    x: 0,
    y: 0,
    draw(ctx) {
        ctx.fillStyle = "red";

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.beginPath();
        ctx.arc(this.x+centerX+rect.x, this.y+centerY+rect.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
};

// 🟦 사각형 객체
const rect = {
    x: 0,
    y: 0,
    width: 100,
    height: -100, //상하 좌우반전고려
    angle: 0, // 도 단위

    draw(ctx, canvas) {
        const rad = -this.angle * Math.PI / 180;

        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        //원점 중심 회전. 
        //원리는 원점이 움직인방향의 반대로 간 다음 회전 후 제자리로 오는 것,
        //그리고 center로 이동

        ctx.setTransform(
            cos, sin,
            -sin, cos,
            origin.x - cos * origin.x + sin * origin.y+centerX+this.x,
            origin.y - sin * origin.x - cos * origin.y+centerY+this.y
        );  

        // 사각형 그리기
        ctx.fillStyle = "lightgray";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.width, this.height);

    }
};

function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    rect.draw(ctx, canvas); // 사각형 그리기
    ctx.restore();

    origin.draw(ctx); // 원점 그리기
    ctx.restore();

    updateCoords();
}

// ✅ UI 이벤트 핸들러들
function applyTranslation() {
    rect.x = parseInt(document.getElementById("moveX").value) || 0;
    rect.y = -parseInt(document.getElementById("moveY").value) || 0; //상하 반전으로 인해 - 붙임임
    draw();
}

function applyRotation() {
    rect.angle = parseInt(document.getElementById("rotateAngle").value) || 0;
    draw();
}

function changeOrigin() {
    origin.x = parseInt(document.getElementById("originX").value) || 0;
    origin.y = -parseInt(document.getElementById("originY").value) || 0; //상하 반전으로 인해 - 붙임임
    draw();
}

function updateCoords() {
    const rad = -rect.angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const ox = origin.x;
    const oy = origin.y;

    const corners = [
        { name: "Left Bottom", x: 0, y: 0 },
        { name: "Right Bottom", x: rect.width, y: 0 },
        { name: "Right Top", x: rect.width, y: rect.height },
        { name: "Left Top", x: 0, y: rect.height },
    ];

    const result = corners.map(corner => {
        const tx = corner.x - ox;
        const ty = corner.y - oy;

        const rx = tx * cos - ty * sin;
        const ry = tx * sin + ty * cos;

        const fx = rx + ox + rect.x;
        const fy = -(ry + oy + rect.y); // ✅ Y축 반전 보정

        //return `${corner.name}: (${fx.toFixed(2)}, ${fy.toFixed(2)})`;
        return `${corner.name}: (${formatPos(fx)}, ${formatPos(fy)})`;
    });

    document.getElementById("coords").textContent = result.join("\n");
}

//-0.00으로 찍히지 않게 방지
function formatPos(val) {
    const fixed = val.toFixed(2);
    return (Object.is(val, -0) || fixed === "-0.00") ? "0.00" : fixed;
}

draw();


document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', () => {
        let val = input.value;

        // 숫자와 '-'만 허용, '-'는 맨 앞에만
        val = val.replace(/[^\d-]/g, '');   // 숫자와 '-' 외 제거
        val = val.replace(/(?!^)-/g, '');   // 맨 앞 외 '-' 제거

        input.value = val;
    });
});


