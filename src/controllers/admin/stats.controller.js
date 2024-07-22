const Response = require('../../models/Response');

exports.recentStats = async (req, res) => {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7));
    const lastSemester = new Date(new Date().setMonth(new Date().getMonth() - 6));

    try {
        const dailyResults = await Response.find({ createdAt: { $gte: startOfToday }, status: 1 })
                                           .populate('user', 'username') // Poblar el campo 'user' con 'username'
                                           .lean();
                                           console.log("Daily Results:", dailyResults); 
        const weeklyResults = await Response.find({ createdAt: { $gte: lastWeek }, status: 1 })
                                            .populate('user', 'username')
                                            .lean();
        const semesterResults = await Response.find({ createdAt: { $gte: lastSemester }, status: 1 })
                                               .populate('user', 'username')
                                               .lean();

        res.render('admin/stats/index', {
            dailyResults,
            weeklyResults,
            semesterResults
        });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).send('Error al obtener estadísticas recientes');
    }
};
