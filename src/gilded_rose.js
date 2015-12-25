function Item(name, sell_in, quality) {
  this.name = name;
  this.sell_in = sell_in;
  this.quality = quality;
}

var items = [];

var config = {
  //最小值
  MIN: 0,
  //最大值
  MAX: 50,
  //从源代码看，sell_in && quality的下降速度都是1. 取负值表示下降;
  speedOfDes: -1,
  //有4种特殊物品
  itemType: [
    "Aged Brie",
    "Sulfuras",
    "Backstage passes",
    "Conjured"
  ]
};

//单例模式
var helper = {
  kindOfItem: function (name) {
    var itemType = config.itemType,
        len = itemType.length;
    var i = 0,
        result = "other"; //默认是other ，指普通物品

    for (; i < len; i++) {
      if (name.indexOf(itemType[i]) > -1) {
        result = itemType[i];
        break;
      }
    }

    return result;
  },
  changeItem: function (data, speed) {
    var min = config.MIN,
        max = config.MAX;

    //处理销售期限sell_in
    data.sell_in--;

    //如果质量等于min或者质量大于等于max（大于是因为有种特殊物品质量恒定80），不再进行处理
    if (speed <= 0 && (data.quality === min || data.quality >= max)) return;

    //排除上面的情况，现在只剩下大于min并且小于max的情况，这种情况下，对质量加上下降速度就可以了
    data.quality = (data.quality += speed) > max ? max : data.quality;
  },
  update_quality: function () {
    var _this = this,
        speedOfDes = config.speedOfDes;
    var speed = null;

    items.forEach(function (current) {
      var sellIn = current.sell_in;

      switch (_this.kindOfItem(current.name)) {
        case "Aged Brie":
          //1倍速度增加
          speed = speedOfDes * -1;
          break;
        case "Sulfuras":
          //该种类物品质量恒定不变并且大于MAX，所以不需要计算速度
          break;
        case "Backstage passes":
          if (sellIn <= 0) {
            //该种类物品一旦过期，质量就会下降为0
            current.quality = 0;
          } else {
            //当大于10天的时候，正常速度增加；大于5天小于等于10天时，2倍速度增加；大于0天小于等于5天时，3倍速度增加
            speed = (sellIn > 10) ? (speedOfDes * -1) : ((sellIn > 5 && sellIn <= 10) ? speedOfDes * -2 : speedOfDes * -3);
          }
          break;
        case "Conjured":
          //两倍速度下降
          speed = speedOfDes * 2;
          break;
        default:
          speed = speedOfDes;
          break;
      }
      _this.changeItem(current, speed);
    });
  }
}