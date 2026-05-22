export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    res.status(201).json({ success: true, message: "Contact form submitted" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
