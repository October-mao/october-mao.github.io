"use strict";

$(function () {
  var toptip = new TopTip();

  // 获取并设置卡号模式
  let cardNumPattern = cookie.get("card_num_pattern");
  if (cardNumPattern) {
    $("#card").val(cardNumPattern);
  }

  let $rslt = $("#rslt");
  let $tip = $(".alert");
  let cn = null;

  async function calc () {
    if (cn) cn.stop();
    $rslt.empty();
    let card = $("#card").val().trim();
    cookie.set("card_num_pattern", card, 24 * 30);
    if (!card) {
      $tip.text("请输入卡号信息！");
      return;
    }

    cn = new CardNo(card);
    if (cn.err) {
      toptip.show(cn.err);
      return;
    }

    $tip.text(`开始计算: ${card}`);

    let curCnt = 0;
    let totalCnt = 0;
    let cards = "";
    let displayCnt = random(90, 110);

    function doRsltCards () {
      displayCnt = random(90, 110);
      $rslt.append($("<pre></pre>").html(cards));
      $tip.text(`共计 ${totalCnt} 条卡号 ......`);
      cards = "";
      curCnt = 0;
    }

    const filterLength = parseInt($("#filterLength").val());
    const filterDigits = $("input[type='checkbox']:checked").map(function () {
      return this.value
    }).get();
    const digitsCount = parseInt($("#digitsCount").val());

    await cn.forEachOnlyLuhnValid(c => {
      if (digitsCount > 0 && filterDigits.length > 0) {
        // 根据空格数量调整 tailLength
        let tailString = c.replace(/\s/g, "").slice(-filterLength);
        const tailLength = filterLength + (tailString.length - tailString.replace(/\s/g, "").length);

        // 过滤包含数字的逻辑
        const tailSegment = c.replace(/\s/g, "").slice(-tailLength);

        // 过滤后几位包含数字的逻辑
        const lastDigits = tailSegment.slice(-digitsCount);
        console.log("lastDigits:", lastDigits);
        console.log("digitsCount:", digitsCount);
        console.log("filterDigits:", filterDigits);
        if (lastDigits.length === digitsCount && !filterDigits.some(digit => lastDigits.includes(digit))) {
          return;
        }
      }

      if (filterLength > 0) {
        // 根据空格数量调整 tailLength
        let tailString = c.replace(/\s/g, "").slice(-filterLength);
        const tailLength = filterLength + (tailString.length - tailString.replace(/\s/g, "").length);

        if (c.replace(/\s/g, "").slice(-tailLength).indexOf("4") !== -1) {
          return;
        }
      }

      curCnt++;
      totalCnt++;
      cards += formatCardNumber(c) + "\n";
      if (curCnt >= displayCnt) {
        doRsltCards();
        return 0;
      }
    });
    if (curCnt > 0) {
      doRsltCards();
    }
    if (totalCnt == 0) {
      $tip.text(`无效的银行卡号: ${card}`);
    } else {
      $tip.text(`共计 ${totalCnt} 条卡号`);
    }
  }




  $("body").on("keydown", e => {
    if (e.which == 13) {
      calc();
    }
  });
  // 多选框状态发生变化时重新查询
  $(document).ready(function () {
    $("#filterLength, input[type='checkbox'], #digitsCount").change(function () {
      calc();
    });
  });
  document.getElementById('card').addEventListener('input', function () {
    var textInput = document.getElementById('card');
    var validCount = document.getElementById('validCount');
    var filteredValue = textInput.value.replace(/\s/g, '');
    validCount.textContent = filteredValue.length;
    calc(); // 每次输入变化时调用 calc 函数
  });

  function calCardLen () {
    var val = $("#card").val();
    val = val.replace(/[ \t]+/g, "");
    $("#card-length").text(val.length);
  }
  calCardLen();
  $("#card").on('change keydown paste input', function () {
    calCardLen();
  });

  mask.hide();

  // 格式化卡号，根据连续出现次数设置颜色 
  function formatCardNumber (cardNumber) {
    console.log(cardNumber)
    let formattedCard = '';
    let count = 1;
    let total = 0;
    let four = 0;
    for (let i = 0; i < cardNumber.length; i++) {
      if (cardNumber[i] === ' ') {
        total++;
        continue;
      }
      if (cardNumber[i] === cardNumber[i + 1] || (cardNumber[i + 1] === ' ' && cardNumber[i] === cardNumber[i + 2])) {
        count++;
      } else {
        if (count >= 4) {
          let color = '4682b4';
          if (count === 4) {
            switch (four) {
              case 0:
                color = '#4682b4';
                break;
              case 1:
                color = '#0000cd';
                break;
              case 2:
                color = '#00008b';
                break;
              default:
                color = 'blue';
            }
            four++;
          } else if (count >= 5) {
            color = '#ff6666'; // 较浅红
          }
          if (total > 0) {
            formattedCard += `<span style="color: ${color};">${cardNumber.substr(i - count + 1 - total, count + total)}</span>`;
          } else {
            formattedCard += `<span style="color: ${color};">${cardNumber.substr(i - count + 1, count)}</span>`;
          }
          total = 0;
        } else {
          if (total > 0) {
            formattedCard += cardNumber.substr(i - count + 1 - 1, count + 1);
          } else {
            formattedCard += cardNumber.substr(i - count + 1, count);
          }
          total = 0;
        }
        count = 1;
      }
    }
    return formattedCard;
  }
});
