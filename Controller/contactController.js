import Contact from "../Models/Contact.js";

// ==========================================
// POST - ADD CONTACT
// POST /api/admin/contact
// ==========================================
export const addContact = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      subject,
      message,
    } = req.body;

    // Validation
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, subject and message are required",
      });
    }

    let contact = await Contact.findOne();

    // Create Contact document if not exists
    if (!contact) {
      contact = new Contact({
        contacts: [],
      });
    }

    // Add contact to array
    contact.contacts.push({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      subject: subject.trim(),
      message: message.trim(),
    });

    await contact.save();

    const newContact =
      contact.contacts[contact.contacts.length - 1];

    return res.status(201).json({
      success: true,
      message: "Contact added successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Add Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add contact",
      error: error.message,
    });
  }
};

