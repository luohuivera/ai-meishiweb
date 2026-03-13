const universities = [
  { id: "pku", name: "北京大学深圳" },
  { id: "thu", name: "清华大学深圳" },
  { id: "hit", name: "哈工大深圳" }
];

const categories = ["中餐", "日料", "西餐&快餐", "饮品&甜点", "轻食", "夜宵烧烤"];

const mockRestaurants = [
  {
    id: 1,
    name: "深大旁边的烤鱼大排档",
    category: "夜宵烧烤",
    uni: "pku",
    rating: 4.8,
    price: 85,
    distance: 300,
    tags: ["排队王", "烟火气", "夜市必吃"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "大学城平山村 234 号",
    hours: "17:00 - 02:00",
    signatureDishes: ["招牌香辣烤鱼", "炭烤生蚝", "炒花甲"],
    reviews: [
      { user: "PKU_小明", text: "每次打完球都要来吃，鱼烤得很脆，够味！" },
      { user: "吃货学姐", text: "毕业前的聚餐首选，回忆满满。" }
    ]
  },
  {
    id: 2,
    name: "Sakura 樱花日料",
    category: "日料",
    uni: "thu",
    rating: 4.6,
    price: 65,
    distance: 500,
    tags: ["高颜值", "适合约会", "新鲜三文鱼"],
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "塘朗城广场 3 楼",
    hours: "11:00 - 21:30",
    signatureDishes: ["火炙三文鱼握", "招牌波奇饭", "地狱拉面"],
    reviews: [
      { user: "THU_摄影社", text: "店面装修很好看，拍照很出片，寿司味道也不错。" },
      { user: "日料狂魔", text: "三文鱼厚切好评，品质在大学城算很好的了！" }
    ]
  },
  {
    id: 3,
    name: "绿野仙踪轻食",
    category: "轻食",
    uni: "hit",
    rating: 4.9,
    price: 32,
    distance: 200,
    tags: ["减脂首选", "健康有机", "超大份量"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "哈工大荔园食堂旁边",
    hours: "09:00 - 20:00",
    signatureDishes: ["香煎鸡胸肉沙拉", "牛油果大虾波波碗", "全麦低脂三明治"],
    reviews: [
      { user: "HIT_工科女生", text: "减脂期每天都吃，酱料可以单独装，很贴心。" },
      { user: "哈工跑团", text: "分量真的很足，碳水蛋白质搭配合理。" }
    ]
  },
  {
    id: 4,
    name: "冰馆 BING GUAN",
    category: "饮品&甜点",
    uni: "thu",
    rating: 4.7,
    price: 25,
    distance: 150,
    tags: ["消暑神仙", "手工现做", "排队火爆"],
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "清华深研院 C 栋一楼",
    hours: "10:00 - 22:30",
    signatureDishes: ["招牌芒果绵绵冰", "芋泥啵啵奶绿", "宇治抹茶西米露"],
    reviews: [
      { user: "清华卷王", text: "夏天复习完来吃一碗冰，简直复活。" },
      { user: "甜品控", text: "芋泥爱好者的天堂，一点都不腻。" }
    ]
  },
  {
    id: 5,
    name: "佬麻雀土钵菜",
    category: "中餐",
    uni: "pku",
    rating: 4.5,
    price: 55,
    distance: 800,
    tags: ["聚餐首选", "下饭神器", "正宗湘菜"],
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "西丽益田假日里 4 层",
    hours: "11:00 - 14:00, 17:00 - 21:00",
    signatureDishes: ["招牌辣椒炒肉", "金钱蛋", "土钵肥肠"],
    reviews: [
      { user: "北大干饭人", text: "社团聚餐经常来，非常下饭，肉炒得很香！" },
      { user: "无辣不欢", text: "真的辣但是真的过瘾。" }
    ]
  },
  {
    id: 6,
    name: "Burger Station",
    category: "西餐&快餐",
    uni: "hit",
    rating: 4.8,
    price: 45,
    distance: 400,
    tags: ["美式复古", "手打牛肉饼", "芝士瀑布"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "哈工大留仙洞旁边",
    hours: "10:30 - 22:00",
    signatureDishes: ["经典双层芝士堡", "现炸粗薯", "香草奶昔"],
    reviews: [
      { user: "HIT_滑板社", text: "肉饼汁水很多，芝士无敌香，汉堡爱好者狂喜。" }
    ]
  },
  {
    id: 7,
    name: "大学城隆江猪脚饭",
    category: "中餐",
    uni: "pku",
    rating: 4.3,
    price: 22,
    distance: 100,
    tags: ["打工人套餐", "上菜快", "男人的浪漫"],
    image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "平山村巷口第一家",
    hours: "09:00 - 21:00",
    signatureDishes: ["招牌猪脚饭", "鸭腿拼饭", "卤蛋肉卷饭"],
    reviews: [
      { user: "肝论文中", text: "男人的浪漫就是一碗猪脚饭，肥而不腻，绝了。" }
    ]
  },
  {
    id: 8,
    name: "深夜食堂拉面馆",
    category: "日料",
    uni: "thu",
    rating: 4.7,
    price: 35,
    distance: 600,
    tags: ["一人食", "深夜慰藉", "浓汤底"],
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "大沙河生态长廊旁边",
    hours: "18:00 - 04:00",
    signatureDishes: ["特浓豚骨拉面", "日式炸鸡块", "可乐饼"],
    reviews: [
      { user: "熬夜画图", text: "半夜两点从实验室出来能吃上一碗热腾腾的面，太幸福了。" }
    ]
  },
  {
    id: 9,
    name: "霸王茶姬 (大学城店)",
    category: "饮品&甜点",
    uni: "hit",
    rating: 4.9,
    price: 18,
    distance: 50,
    tags: ["爆款必喝", "国风", "清爽解腻"],
    image: "https://images.unsplash.com/photo-1541658016709-81333e6c0c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "哈工大校门口",
    hours: "10:00 - 22:00",
    signatureDishes: ["伯牙绝弦", "寻香山茶", "青青糯山"],
    reviews: [
      { user: "天天想喝", text: "伯牙绝弦yyds，喝不腻！" }
    ]
  },
  {
    id: 10,
    name: "大龙燚火锅",
    category: "夜宵烧烤",
    uni: "thu",
    rating: 4.6,
    price: 115,
    distance: 900,
    tags: ["重口味", "环境好", "聚会无敌"],
    image: "https://images.unsplash.com/photo-1563379926898-05f4e5113945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "塘朗城广场 4 楼",
    hours: "11:00 - 02:00",
    signatureDishes: ["大刀毛肚", "冰川鹅肠", "麻辣牛肉"],
    reviews: [
      { user: "清华川菜狂热粉", text: "红锅很给力，够辣，团建好去处。" }
    ]
  },
  {
    id: 11,
    name: "东北老铁烤冷面",
    category: "夜宵烧烤",
    uni: "hit",
    rating: 4.8,
    price: 15,
    distance: 50,
    tags: ["路边摊神话", "加满料", "便宜实惠"],
    image: "https://images.unsplash.com/photo-1627522460108-21da6c53e054?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "哈工大侧门小吃街小推车",
    hours: "18:00 - 24:00",
    signatureDishes: ["豪华霸王烤冷面", "加虾条加肉松"],
    reviews: [
      { user: "夜跑选手", text: "跑完步来一份，罪恶又快乐！大叔人超好。" }
    ]
  },
  {
    id: 12,
    name: "Green Bites 意面",
    category: "西餐&快餐",
    uni: "pku",
    rating: 4.4,
    price: 55,
    distance: 250,
    tags: ["精致简餐", "意式风情", "安静舒适"],
    image: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "北大深研院咖啡街",
    hours: "11:30 - 20:30",
    signatureDishes: ["黑松露蘑菇意面", "经典茄汁肉酱面", "南瓜浓汤"],
    reviews: [
      { user: "安静学习", text: "环境很适合看书，意面也很地道。" }
    ]
  }
];
