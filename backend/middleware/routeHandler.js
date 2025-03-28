const routeHandler = {
    async invoke(res, fun) {
        try {
            const data = await fun();
            res.status(200).json({ status: 200, data })
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
}

module.exports = routeHandler;