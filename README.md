#Jump Duck Design Document

##Main Objective
Jump duck is a multiplayer game written using javascript.  The entire system is 
hand-written and is designed as a test of javascript game-coding skills.  The project will be decomposed into steps to be accomplished incrementally.

##Game Rules
1. All players spawn in the forward position (out of 4).  
2. When the game starts, all players begin running to the right at a fixed pace.
3. "hi" and "low" bars spawn at random intervals and move from right to left across the screen.
4. players must jump or duck to avoid hitting the bars.  Contact with a bar will send the player back one position (out of 4).  
5. When you are hit by a bar in position 4 you are eliminated and removed from the game.
6. The last player alive wins!
7. Score screen at the end shows the winner and their longest streak of dodges.

##Phase 1
1. Construct game object with requisite methods and attributes.
2. Construct run-loop that can be started, stopped, and implement a global game-state for menus, gameplay, warmup, and score screens.
