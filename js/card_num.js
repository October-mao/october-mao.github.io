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
    console.log(card);
    cookie.set("card_num_pattern", card, 24 * 30);
    if (!card) {
      $tip.text("请输入卡号信息！");
      return;
    }

    cn = new CardNo(card);
    console.log(cn);
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

    await cn.forEachOnlyLuhnValid(c => {
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
  // 复选框状态变化时重新查询
  $(document).ready(function () {
    $("#filterLength").change(function () {
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

  // 格式化卡号，根据连续出现次数设置颜色 6231 3618 8886 6666  i=12  count=4
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
            console.log('total = ' + total + 'count = ' + count + 'i = ' + i + '截取 = ' + cardNumber.substr(i - count + 1 - total, count + total));
          } else {
            formattedCard += `<span style="color: ${color};">${cardNumber.substr(i - count + 1, count)}</span>`;
            console.log('count = ' + count + 'i = ' + i + '截取 = ' + cardNumber.substr(i - count + 1, count));
          }
          total = 0;
        } else {
          if (total > 0) {
            formattedCard += cardNumber.substr(i - count + 1 - 1, count + 1);
            console.log('total = ' + total + 'count = ' + count + 'i = ' + i + '截取 = ' + cardNumber.substr(i - count + 1 - 1, count + 1));
          } else {
            formattedCard += cardNumber.substr(i - count + 1, count);
            console.log('count = ' + count + 'i = ' + i + '截取 = ' + cardNumber.substr(i - count + 1, count));
          }
          total = 0;
        }
        count = 1;
      }
    }
    return formattedCard;
  }
});
