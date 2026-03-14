import Company from '../models/tnp.model.js';

// @desc    Get all companies (with optional pagination)
// @route   GET /api/tnpdata
export const getCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const companies = await Company.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ companyName: 1 });
    const total = await Company.countDocuments();
    res.json({ companies, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single company by ID
// @route   GET /api/tnpdata/:id
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new company
// @route   POST /api/tnpdata
export const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a company
// @route   PUT /api/tnpdata/:id
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a company
// @route   DELETE /api/tnpdata/:id
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};