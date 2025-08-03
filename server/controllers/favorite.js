const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Action Favorite (Add or Remove in one function)
const actionFavorite = async (req, res, next) => {
  try {
    const { placeId, isFavorite } = req.body;
    const userId = req.user.id;

    // ตรวจสอบว่ามี place นี้อยู่จริงหรือไม่
    const place = await prisma.place.findUnique({
      where: { id: parseInt(placeId) },
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบสถานที่นี้",
      });
    }

    // ADD or REMOVE
    let result;
    if (isFavorite) {
      // Remove favorite
      result = await prisma.favorite.deleteMany({
        where: {
          userId: userId,
          placeId: parseInt(placeId),
        },
      });
    } else {
      // Add favorite
      result = await prisma.favorite.create({
        data: {
          placeId: parseInt(placeId),
          userId: userId,
        },
      });
    }

    console.log(isFavorite);
    res.json({
      success: true,
      message: isFavorite ? "Remove Favorite" : "Add Favorite",
      result: result,
    });
  } catch (error) {
    console.error("Action favorite error:", error);
    next(error);
  }
};

// List Favorites
const listFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        Place: {
          include: {
            galleries: true,
            User: {
              select: {
                username: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const favoriteWithLike = favorites.map((item) => ({
      ...item,
      Place: {
        ...item.Place,
        isFavorite: true,
      },
    }));

    res.json({
      success: true,
      result: favoriteWithLike,
      count: favorites.length,
    });
  } catch (error) {
    console.error("List favorites error:", error);
    next(error);
  }
};

// ตรวจสอบว่าเป็นรายการโปรดหรือไม่
const checkFavorite = async (req, res) => {
  try {
    const { placeId } = req.params;
    const userId = req.user.id;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_placeId: {
          userId: userId,
          placeId: parseInt(placeId),
        },
      },
    });

    res.json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Check favorite error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบรายการโปรด",
      error: error.message,
    });
  }
};

module.exports = {
  actionFavorite,
  listFavorites,
  checkFavorite,
};
