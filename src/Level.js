'use strict';

class Level {
	constructor() {

		this.tileSize = 64;

		this.width = 10;
		this.height = 10;

		this.tiles = new Int32Array(this.width * this.height);

		for (let j = 0; j < this.width; j++) {
			for (let i = 0; i < this.height; i++) {
				let index = j + i * this.width;
				console.log(index);
				if ((i >= 7)) {
					
					this.tiles[index] = 1;
				} else {
					this.tiles[index] = 0;
				}
				
			}
		}

		this.texture = "res/background.jpeg";
		this.blocks = "res/blocks.png";

		this.drawsFrame = 0;

		this.first = false;

	}

	updateServer(deltaTime, serverNet, allPlayers) {
		this.players = new Array();

		//console.log(allPlayers);

		for (let i = 0; i < allPlayers.length; i++) {
			let p = allPlayers[i].player;
			this.players.push(p);
		}

		this.players.push();

		if (this.first == false) {
			this.first = true;
			let z = new Zombie(new Vec2(800, 1800));
			this.zombies.push(z);
			serverNet.broadcastCreateZombie(z);

			z = new Zombie(new Vec2(1000, 1800));
			this.zombies.push(z);
			serverNet.broadcastCreateZombie(z);

		}


		for (let i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update(this, deltaTime);
		}

		for (let i = 0; i < this.zombies.length; i++) {
			this.zombies[i].update(this, deltaTime);
		}


	}

	draw(view, width, height) {


		ctx.drawImage(texture.getTexture(this.texture), 0, 0, 640, 640);

		ctx.drawImage(texture.getTexture(this.blocks), 0, 0, 640, 640);


		var vec = view;
		vec.x = Math.round(vec.x);
		vec.y = Math.round(vec.y);

		ctx.save();
		//ctx.translate(vec.x, vec.y);
		

		for (let j = 0; j < this.width; j++) {
			for (let i = 0; i < this.height; i++) {
				let index = j + i * this.width;
				if (this.tiles[index] > 0) {
					ctx.strokeRect(j * 64, i * 64, 64, 64);
				}

			}
		}

		ctx.restore();

	}

	drawOld(view, width, height) {
		var vec = view;
		vec.x = Math.round(vec.x);
		vec.y = Math.round(vec.y);

		this.drawsFrame = 0;
		this.drawChunks(vec, width, height);

	}

	drawChunk(vec, width, height, chunk) {
		ctx.drawImage(chunk.offscreenCanvas, 0, 0, chunk.offscreenCanvas.width, chunk.offscreenCanvas.height, vec.x + 0 * this.tileSize, vec.y + 0 * this.tileSize, chunk.offscreenCanvas.width, chunk.offscreenCanvas.height);
	}


	hit(v) {
		var x = (v.x) / this.tileSize >> 0;
		var y = (v.y) / this.tileSize >> 0;

		var tileIndex = x + y * this.width;
		if (tileIndex < 0 || tileIndex >= this.width * this.height)
			return false;

		if (this.tiles[tileIndex] > 0) {
			return true;
		}
		return false;
	}

	removeWall(v) {

		var x = Math.floor((v.x) / this.tileSize);
		var y = Math.floor((v.y) / this.tileSize);
		var tileIndex = x + y * this.width;
		if (tileIndex < 0 || tileIndex >= this.width * this.width)
			return;

		this.tiles[tileIndex] = 0;
	}

}