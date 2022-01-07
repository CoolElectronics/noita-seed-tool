var intMul = function (a, b) {
  var ah = (a >>> 16) & 0xffff,
    al = a & 0xffff,
    bh = (b >>> 16) & 0xffff,
    bl = b & 0xffff;
  return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
};
// https://github.com/bridgedotnet/Bridge/blob/8b1a4a0dee448319ac7bb0879d0019a26285e100/Bridge/Resources/Integer.js#L720-L738
var intTrunc = function (num) {
  return num > 0 ? Math.floor(num) : Math.ceil(num);
};
var intDiv = function (x, y) {
  if (y === 0) {
    throw new Error("Dividing by Zero");
  }
  return intTrunc(x / y);
};
var toInt = function (i) {
  return Math.max(2147483648 * -1, Math.min(Math.floor(i), 2147483647)) | 0;
};
var toUInt = function (i) {
  return Math.max(0, Math.min(Math.floor(i), 4294967295)) >>> 0;
};
var NollaPrng = /** @class */ (function () {
  function NollaPrng(seed /* int, double */) {
    this.SEED_BASE = 23456789 + 1 + 11 * 11;
    // this.seed = seed;
    this.seed = toUInt(seed);
    this.Next();
  }
  NollaPrng.prototype.Next = function () {
    // this.seed =
    // toInt(this.seed) * 16807 + toInt(this.seed) / 127773 * -2_147_483_647;
    this.seed =
      (intMul(toInt(this.seed), 16807) +
        intMul(intDiv(toInt(this.seed), 127773) | 0, -2147483647)) |
      0;
    // this.seed = Math.min(
    // 	toInt(this.seed) * 16807 + toInt(this.seed) / 127773,
    // 	2_147_483_646
    // );
    if (this.seed < 0) {
      this.seed += 2147483647 | 0;
    }
    return this.seed / 2147483647;
  };
  NollaPrng.BETA_SEED = false;
  return NollaPrng;
})();
var MaterialPicker = /** @class */ (function () {
  function MaterialPicker(prng, worldSeed /* uint */) {
    this.Materials = [];
    this.PRNG = prng;
    this.PickMaterials(MaterialPicker.LIQUIDS, 3);
    this.PickMaterials(MaterialPicker.ALCHEMY, 1);
    this.ShuffleList(worldSeed);
    this.PRNG.Next();
    this.PRNG.Next();
  }
  MaterialPicker.prototype.PickMaterials = function (source, count /* int */) {
    var counter = 0; // int
    var failed = 0; // int
    while (counter < count && failed < 99999) {
      var rand = this.PRNG.Next() * source.length;
      var i = toInt(rand);
      var picked = source[i];
      if (!this.Materials.includes(picked)) {
        this.Materials.push(picked);
        counter++;
      } else {
        failed++;
      }
    }
    return;
  };
  MaterialPicker.prototype.ShuffleList = function (worldSeed /* uint */) {
    var _a;
    var prng = new NollaPrng((worldSeed >> 1) + 12534);
    // Toxic sludge, blood, and soil for first
    for (var i = this.Materials.length - 1; i >= 0; i--) {
      var rand = toInt(prng.Next() * (i + 1));
      (_a = [this.Materials[rand], this.Materials[i]]),
        (this.Materials[i] = _a[0]),
        (this.Materials[rand] = _a[1]);
    }
  };
  MaterialPicker.PickForSeed = function (worldSeed /* uint */) {
    var prng = new NollaPrng(worldSeed * 0.17127 + 1323.5903);
    // Preheat random!
    for (var i = 0; i < 5; i++) {
      prng.Next();
    }
    var LC = new MaterialPicker(prng, worldSeed);
    var AP = new MaterialPicker(prng, worldSeed);
    return {
      seed: worldSeed,
      LC: [LC.Materials[0], LC.Materials[1], LC.Materials[2]],
      AP: [AP.Materials[0], AP.Materials[1], AP.Materials[2]],
    };
  };
  MaterialPicker.LIQUIDS = [
    "acid",
    "alcohol",
    "blood",
    "blood_fungi",
    "blood_worm",
    "cement",
    "lava",
    "berserkium",
    "pheremone",
    "levitatium",
    "hastium",
    "invisibillium",
    "concentrated mana",
    "acceleratum",
    "ambrosia",
    "teleportatium",
    "unstable polymorphium",
    "unstable teleportatium",
    "worm pheremone",
    "fluxmonium",
    "mud",
    "oil",
    "poison",
    "toxic sludge",
    "swamp",
    "urine",
    "water",
    "slush",
    "swamp 2?",
    "chaotic polymorphium",
  ];
  MaterialPicker.ALCHEMY = [
    "bone box2d",
    "brass",
    "coal",
    "copper",
    "diamond",
    "fungal soil",
    "gold",
    "grass",
    "gunpowder",
    "gunpowder explosive",
    "rotten meat",
    "sand_petrify",
    "silver",
    "slime",
    "snow",
    "soil",
    "wax",
    "honey",
  ];
  return MaterialPicker;
})();
