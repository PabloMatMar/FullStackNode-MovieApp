const logout = (req, res) => {
    try {
        res.clearCookie("token").redirect("/");
    } catch (err) {
        res.status(500).send({ err: err.message });
    };
};

module.exports = {
    logout
}