import Company from "../models/companyModel.js";

export const addCompany = async (req, res) => {
  try {

    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      company
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getCompanies = async (req, res) => {

  try {

    const companies = await Company.find();

    res.status(200).json({
      success: true,
      companies
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};