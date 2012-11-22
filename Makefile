all: game/dc-tycoon.t3

game/obj:
	mkdir -p game/obj

game/dc-tycoon.t3: game/obj
	cd game && t3make -cs UTF-8 -d -f dc-tycoon

play:
	t3run -cs UTF-8 game/dc-tycoon.t3

clean:
	rm -r game/obj
	rm game/dc-tycoon.t3
