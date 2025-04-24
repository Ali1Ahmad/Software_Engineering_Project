export const getMe = (req, res) => {
    res.json(req.user);
  };
  
  export const updateMe = async (req, res) => {
    const upFields = ['name','email','phone','address'];
    upFields.forEach(f => {
      if (req.body[f] !== undefined) req.user[f] = req.body[f];
    });
    await req.user.save();
    res.json(req.user);
  };
  