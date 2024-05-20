document.getElementById("usageButton").addEventListener("click", function(event) {
    // 创建一个弹出框
    var modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // 半透明黑色背景
    modal.style.zIndex = "9999"; // 确保在最顶层

    // 创建说明框内容
    var content = document.createElement("div");
    content.style.position = "absolute";
    content.style.top = "50%";
    content.style.left = "50%";
    content.style.transform = "translate(-50%, -50%)";
    content.style.backgroundColor = "#fff";
    content.style.padding = "20px";
    content.style.borderRadius = "8px";
    content.style.width = "90%"; // 设置说明框的宽度为视口的90%

    // 填充说明内容
    content.innerHTML = `
        <h2>使用说明</h2>
        <p>该功能主要用于银行卡号定制时的算号，可提前找出满足 Luhn 算法的银行卡号（注意，满足 Luhn 算法不等于可以直接使用，因已使用、注销、冻结、银行保留等原因，该卡号不一定能够开出）。</p>
        <h3>如何使用？</h3>
        <p>输入数字、英文字母、* 号的任意组合，即可生成符合 Luhn 算法的卡号。如输入”6217 *aaa bbbb cccc”，会生成包括且不限于以下的卡号：</p>
		<ul>
            <li>6217 8888 0000 0000</li>
            <li>6217 8888 0000 8888</li>
            <li>6217 8888 1111 7777</li>
            <li>6217 8888 2222 6666</li>
        </ul>
        <h3>字母和 * 号的区别？</h3>
        <p>字母：生成的任意一条卡号中，相同字母对应的数字必相同（如 aaa 只对应 000、111 等，不会对应 001）；不同字母对应的数字，可能相同，也可能不同（如 aaa bbbb cccc，可能对应 000 0000 0000，也可能对应 000 1111 4444 等）；</p>
        <p>* 号：生成的任意一条卡号中，多个 * 号对应的数字可能相同，也可能不同（如 **，可能对应 00，也可能对应 01 等）</p>
    `;

    // 创建关闭按钮
    var closeButton = document.createElement("button");
    closeButton.innerHTML = "关闭";
    closeButton.style.position = "absolute";
    closeButton.style.bottom = "10px";
    closeButton.style.right = "10px";
    closeButton.style.border = "none";
    closeButton.style.backgroundColor = "red";
    closeButton.style.color = "#fff";
    closeButton.style.padding = "5px 10px";
    closeButton.style.borderRadius = "4px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "14px";

    // 点击关闭按钮时移除说明框
    closeButton.addEventListener("click", function(event) {
        document.body.removeChild(modal);
    });

    // 添加关闭按钮到内容
    content.appendChild(closeButton);

    // 添加内容到弹出框
    modal.appendChild(content);

    // 添加弹出框到页面
    document.body.appendChild(modal);

    // 点击弹出框外部时关闭弹出框
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
});
