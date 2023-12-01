document.onreadystatechange = function () {
  if (document.readyState == "complete") {
      var grid =  [[0,0,false],[100,0,false],[200,0,false],[300,0,false],
                   [0,100,false],[100,100,false],[200,100,false],[300,100,false],
                   [0,200,false],[100,200,false],[200,200,false],[300,200,false],
                   [0,300,false],[100,300,false],[200,300,false],[300,300,true]];

      var puzzleAreaContents = document.getElementById("puzzlearea").children;
      var shuffleTracker = 0;
      var numberOfMoves = 0;
      var startTime;
      var elapsedTime = 0;
      var timerInterval;

      function startTimer() {
          startTime = new Date().getTime();
          timerInterval = setInterval(updateTime, 1000);
      }

      function updateTime() {
          var currentTime = new Date().getTime();
          elapsedTime = Math.floor((currentTime - startTime) / 1000);
          document.getElementById("elapsedTime").innerHTML = elapsedTime;
      }
		document.getElementById("cheatbutton").onclick = function () {
		location.reload(); 
		};
      document.getElementById("overall").insertAdjacentHTML('beforeend', "Number of moves: <span id='numberOfMoves'>0</span></br>");
      document.getElementById("overall").insertAdjacentHTML('beforeend', "Time elapsed: <span id='elapsedTime'>0</span>");

      function checkIfComplete() {
          var check = ""
          var arr = document.getElementById("puzzlearea").children;
          for (i = 0; i < arr.length; i++) {
              check = check + arr[i].innerHTML 
          };
          if (check == "123456789101112131415" && numberOfMoves > 20) {
              celebrate();
              return true;
          }
      }

      function celebrate() {
          clearInterval(timerInterval);
          document.getElementById("puzzlearea").innerHTML = "<div><img onclick='location.reload();' src='patrick.jpg' width='250px'/></div><br /><h2 onclick='location.reload();'>Best record: " + elapsedTime + " seconds and " + numberOfMoves + " moves!</h2></br><p>Click on the image to restart!</p>";
          document.getElementById("shufflebutton").outerHTML = "";
      }

      function shuffle(shuffleTracker) {
          var rand = getRandomElement();
          shiftPuzzlePiece.call(puzzleAreaContents[rand]);
          if (shuffleTracker < 199) { 
              shuffleTracker = shuffleTracker + 1;
              shuffle(shuffleTracker);
          } else {
              shuffleTracker = 0;
              numberOfMoves = 0; 
              document.getElementById("numberOfMoves").innerHTML = numberOfMoves;
          }
      }

      function getRandomElement() {
          var movables = getArrayOfMovableCells();
          return movables[Math.floor(Math.random() * movables.length)];
      }

      function openBlock() {
          for (i = 0; i < grid.length; i++) {
              if (grid[i][2] == true) { return i; }
          }
      }

      function getArrayOfMovableCells() {
          var open = openBlock();
          var movables = [open-4, open-1, open+1, open+4];
          var count = movables.length;
          for (i = 0; i < count; i++) {
              if (movables[i] < 0 || movables[i] > 15) { movables[i] = null }
              if (open % 4 === 3 && movables.includes(open + 1)) { movables[movables.indexOf(open + 1)] = null }
              if (open % 4 === 0 && movables.includes(open - 1)) { movables[movables.indexOf(open - 1)] = null }
          }
          return movables.filter(function(val) { return val !== null; });
      }

      function addPuzzlePieceHover() {
          this.className = this.className + " puzzlepiecehover";
      }

      function removePuzzlePieceHover() {
          this.className = "puzzlepiece";
      }

      function shiftPuzzlePiece() {
          numberOfMoves++;
          document.getElementById("numberOfMoves").innerHTML = numberOfMoves; 
          this.style.left = grid[openBlock()][0]+"px";
          this.style.top = grid[openBlock()][1]+"px";
          this.className = "puzzlepiece";

          var collection = Array.prototype.slice.call(puzzleAreaContents);
          var movedBlock = collection.indexOf(this);
          var openBlockIndex = collection.indexOf(puzzleAreaContents[openBlock()]);
          
          var switchVariable = collection[movedBlock];
          collection[movedBlock] = collection[openBlockIndex];
          collection[openBlockIndex] = switchVariable;

          document.getElementById("puzzlearea").innerHTML = "";
          for (i = 0; i < collection.length; i++) {
              document.getElementById("puzzlearea").innerHTML += collection[i].outerHTML;
          }

          grid[openBlock()][2] = false;
          grid[movedBlock][2] = true;
          removeEventListeners(getArrayOfMovableCells());
          if (checkIfComplete()) { return; } 
          addEventListeners(getArrayOfMovableCells());
      }

      function addEventListeners(movables) {
          for (i = 0; i < movables.length; i++) {
              puzzleAreaContents[movables[i]].addEventListener("mouseover", addPuzzlePieceHover, false);
              puzzleAreaContents[movables[i]].addEventListener("mouseout", removePuzzlePieceHover, false);
              puzzleAreaContents[movables[i]].addEventListener("click", shiftPuzzlePiece);
          }
      }

      function removeEventListeners(movables) {
          for (i = 0; i < movables.length; i++) {
              puzzleAreaContents[movables[i]].removeEventListener("mouseover", addPuzzlePieceHover, false);
              puzzleAreaContents[movables[i]].removeEventListener("mouseout", removePuzzlePieceHover, false);
              puzzleAreaContents[movables[i]].removeEventListener("click", shiftPuzzlePiece, false);
          }
      }

      function initializePuzzleArea() {
          var x = 0;
          var y = 0;
          for (i = 0; i < puzzleAreaContents.length; i++) {
              puzzleAreaContents[i].setAttribute("class", "puzzlepiece");
              puzzleAreaContents[i].style.top = y + "px";
              puzzleAreaContents[i].style.left = x + "px";
              puzzleAreaContents[i].style.backgroundPosition = "-" + x + "px -" + y + "px";
              x = (x + 100) % 400;
              y += x === 0 ? 100 : 0;
          }
          document.getElementById("puzzlearea").innerHTML += "<div class='empty'></div>";
          addEventListeners(getArrayOfMovableCells());
      }

      function playShuffleSound() {
          var audio = document.getElementById("shuffleSound");
          audio.play();
      }

      document.getElementById("shufflebutton").onclick = function () {
          shuffle(shuffleTracker);
          playShuffleSound();
          startTimer();
      };

      function updateVolume() {
          var audio = document.getElementById("shuffleSound");
          var volumeSlider = document.getElementById("volumeSlider");
          audio.volume = parseFloat(volumeSlider.value);
      }

      var volumeSlider = document.getElementById("volumeSlider");
      volumeSlider.addEventListener("input", updateVolume);

      function changeBackgroundImage() {
          var selectMenu = document.getElementById("backgrounds");
          var selectedImage = selectMenu.options[selectMenu.selectedIndex].value;
          var puzzlePieces = document.getElementsByClassName("puzzlepiece");
          for (var i = 0; i < puzzlePieces.length; i++) {
              puzzlePieces[i].style.backgroundImage = "url('" + selectedImage + "')";
          }
      }

      document.getElementById("backgrounds").addEventListener("change", changeBackgroundImage);

      initializePuzzleArea();
  }
};
