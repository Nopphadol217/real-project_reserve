const prisma = require("../config/prisma");

// ADD or REMOVE Favorite
exports.actionFavorite = async (req, res, next) => {
  try {
    const { placeId, isFavorite } = req.body;
    const userId = req.user.id;

    console.log("Favorite action:", { userId, placeId, isFavorite });

    let result;
    if (isFavorite) {
      // REMOVE - ลบ favorite
      result = await prisma.favorite.deleteMany({
        where: {
          userId: userId,
          placeId: placeId,
        },
      });
    } else {
      // ADD - เพิ่ม favorite (ใช้ upsert เพื่อหลีกเลี่ยง duplicate)
      result = await prisma.favorite.upsert({
        where: {
          userId_placeId: {
            userId: userId,
            placeId: placeId,
          },
        },
        update: {}, // ไม่ต้องอัปเดตอะไร ถ้ามีอยู่แล้ว
        create: {
          placeId: placeId,
          userId: userId,
        },
      });
    }

    console.log("Favorite result:", result);
    res.json({
      message: isFavorite ? "Remove Favorite" : "Add Favorite",
      result: result,
      success: true,
    });
  } catch (error) {
    console.error("Error in actionFavorite:", error);
    next(error);
  }
};

// List User's Favorites
exports.listFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log("Getting favorites for user:", userId);

    const favorites = await prisma.favorite.findMany({
      where: { userId: userId },
      include: {
        place: {
          include: {
            galleries: {
              select: {
                placeId: true,
                secure_url: true,
                public_id: true,
              },
            },
            roomDetails: {
              select: {
                id: true,
                name: true,
                price: true,
                status: true,
              },
            },
          },
        },
      },
    });

    // แปลง amenities และเพิ่ม isFavorite = true
    const favoriteWithLike = favorites.map((item) => ({
      ...item,
      place: {
        ...item.place,
        amenities: item.place.amenities ? JSON.parse(item.place.amenities) : [],
        isFavorite: true,
      },
    }));

    res.json({
      result: favoriteWithLike,
      count: favoriteWithLike.length,
      success: true,
    });
  } catch (error) {
    console.error("Error in listFavorites:", error);
    next(error);
  }
};
