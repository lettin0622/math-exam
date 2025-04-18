let questions;
let questionRows = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let answered = false;

let questionText;
let options;
let inputBox;
let submitButton;
let resultText;

function preload() {
  questions = loadTable("questions.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 把題目資料轉成 array 並打亂
  questionRows = questions.getRows();
  shuffle(questionRows, true); // 隨機排序

  // UI 元件
  questionText = createP("");
  questionText.style("font-size", "40px");
  questionText.style("font-weight", "bold");
  questionText.style("color", "black");
  questionText.style("text-align", "center");
  questionText.style("line-height", "2");

  options = createRadio();
  options.style("font-size", "30px");
  options.style("font-weight", "bold");
  options.style("line-height", "2");

  inputBox = createInput("");
  inputBox.style("font-size", "30px");
  inputBox.style("padding", "10px");
  inputBox.style("border", "2px solid gray");
  inputBox.style("border-radius", "10px");
  inputBox.hide();

  submitButton = createButton("送出");
  submitButton.style("font-size", "30px");
  submitButton.style("padding", "15px 30px");
  submitButton.style("border-radius", "15px");
  submitButton.style("box-shadow", "2px 2px 10px rgba(0, 0, 0, 0.3)");
  submitButton.mousePressed(handleButtonClick);

  resultText = createP("");
  resultText.style("font-size", "30px");
  resultText.style("font-weight", "bold");
  resultText.style("color", "black");
  resultText.style("text-align", "center");

  loadQuestion();
}

function draw() {
  background("#EDE7E3");

  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;

  fill("#FEEAFA");
  noStroke();
  rect(rectX, rectY, rectWidth, rectHeight);

  questionText.position(windowWidth / 2 - questionText.size().width / 2, rectY + 50);
  options.position(windowWidth / 2 - options.size().width / 2, rectY + 150);
  inputBox.position(windowWidth / 2 - inputBox.size().width / 2, rectY + 150);
  submitButton.position(windowWidth / 2 - 75, rectY + 250);
  resultText.position(windowWidth / 2 - resultText.size().width / 2, rectY + 320);
}

function handleButtonClick() {
  if (!answered) {
    let currentRow = questionRows[currentQuestionIndex];
    let correctAnswer = String(currentRow.get("answer")).trim().toLowerCase();
    let selectedOption = "";

    if (currentRow.get("type") === "choice") {
      selectedOption = String(options.value() || "").trim().toLowerCase();
    } else if (currentRow.get("type") === "fill") {
      selectedOption = String(inputBox.value() || "").trim().toLowerCase();
    }

    console.log("輸入答案：", selectedOption);
    console.log("正確答案：", correctAnswer);

    if (selectedOption === correctAnswer) {
      resultText.html("✅ 答對了！");
      correctCount++;
    } else {
      resultText.html(`❌ 答錯了，正確答案是：${correctAnswer}`);
      incorrectCount++;
    }

    answered = true;
    submitButton.html("下一題");

  } else {
    currentQuestionIndex++;
    answered = false;
    if (currentQuestionIndex < questionRows.length) {
      loadQuestion();
    } else {
      showFinalResult();
    }
  }
}

function loadQuestion() {
  let currentRow = questionRows[currentQuestionIndex];
  questionText.html(currentRow.get("question"));

  if (currentRow.get("type") === "choice") {
    options.show();
    inputBox.hide();
    options.html(""); // 清空舊選項
    options.option(currentRow.get("option1"));
    options.option(currentRow.get("option2"));
    options.option(currentRow.get("option3"));
    options.option(currentRow.get("option4"));
  } else {
    options.hide();
    inputBox.show();
    inputBox.value(""); // 清空文字框
  }

  resultText.html("");
  submitButton.html("送出");
}

function showFinalResult() {
  questionText.html("🎉 測驗完成！");
  options.hide();
  inputBox.hide();
  resultText.html(`✔️ 答對：${correctCount} 題<br>❌ 答錯：${incorrectCount} 題`);
  submitButton.html("再試一次");

  submitButton.mousePressed(() => {
    shuffle(questionRows, true);
    currentQuestionIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    answered = false;
    submitButton.html("送出");
    submitButton.mousePressed(handleButtonClick); // 回到原本的流程
    loadQuestion();
  });
}
