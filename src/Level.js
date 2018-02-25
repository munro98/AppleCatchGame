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


	drawChunks(vec, width, height) {

		var startX = Math.max(0, Math.floor((-vec.x) / (this.tileSize * this.chunkSize)));
		var startY = Math.max(0, Math.floor((-vec.y) / (this.tileSize * this.chunkSize)));

		var endX = Math.min(this.chunkCount, Math.floor((-vec.x + width + (this.tileSize * this.chunkSize)) / (this.tileSize * this.chunkSize)));
		var endY = Math.min(this.chunkCount, Math.floor((-vec.y + height + (this.tileSize * this.chunkSize)) / (this.tileSize * this.chunkSize)));

		for (var j = startY; j < this.chunkCount && j < endY; j++) {
			for (var i = startX; i < this.chunkCount && i < endX; i++) {

				var chunk;
				if (this.chunkMap[i + j * this.chunkCount] == undefined) {
					//create chunk
					chunk = new Chunk(i, j, this);
					this.chunkMap[i + j * this.chunkCount] = chunk;
					//render to it
					this.drawToChunk(chunk);

				} else {
					chunk = this.chunkMap[i + j * this.chunkCount];
				}
				//render chunk
				ctx.drawImage(chunk.offscreenCanvas, 0, 0, chunk.offscreenCanvas.width, chunk.offscreenCanvas.height, vec.x + i * (this.tileSize * this.chunkSize), vec.y + j * (this.tileSize * this.chunkSize), chunk.offscreenCanvas.width, chunk.offscreenCanvas.height);
				this.drawsFrame++;
			}

		}

	}

	drawToChunk(chunk) {
		this.drawToChunkLayer(chunk, this.ground);
		this.drawToChunkLayer(chunk, this.roads);
		this.drawToChunkLayer(chunk, this.interior);

	}

	drawToChunkLayer(chunk, layer) {
		var startX = chunk.x * this.chunkSize;
		var startY = chunk.y * this.chunkSize;

		for (var y = startY, yy = 0; y < this.width && yy < this.tileSize; y++, yy++) {
			for (var x = startX, xx = 0; x < this.width && xx < this.tileSize; x++, xx++) {
				var tile = layer[x + y * this.width] - 1;
				if (tile == -1) {
					continue;
				}

				var tileX = tile % 54; // 54 is the number of tiles in each row
				var tileY = Math.floor(tile / 54);

				chunk.ctx.drawImage(this.tileImage, tileX * this.tileSize, tileY * this.tileSize, this.tileSize, this.tileSize, xx * this.tileSize, yy * this.tileSize, this.tileSize, this.tileSize);
				this.drawsFrame++;
			}

		}
	}


	drawLayer(vec, width, height, layer) {
		var startX = Math.max(0, Math.floor((-vec.x) / this.tileSize));
		var startY = Math.max(0, Math.floor((-vec.y) / this.tileSize));

		var endX = Math.min(this.width, Math.floor((-vec.x + width + this.tileSize) / this.tileSize));
		var endY = Math.min(this.width, Math.floor((-vec.y + height + this.tileSize) / this.tileSize));


		for (var y = startY; y < this.width && y < endY; y++) {
			for (var x = startX; x < this.width && x < endX; x++) {

				var tile = layer[x + y * this.width] - 1;
				if (tile == -1) {
					continue;
				}

				var tileX = tile % 54; // 54 is the number of tiles in each row
				var tileY = Math.floor(tile / 54);
				//
				ctx.drawImage(this.tileImage, tileX * this.tileSize, tileY * this.tileSize, this.tileSize, this.tileSize, vec.x + x * this.tileSize, vec.y + y * this.tileSize, this.tileSize, this.tileSize);
				this.drawsFrame++;
			}

		}
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

		this.interior[tileIndex] = 0;
	}

}