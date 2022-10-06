const {
  createBrandService,
  getBrandService,
  getBrandByIdService,
  updateBrandService,
} = require('../services/brand.services');

exports.createBrand = async (req, res) => {
  try {
    const result = await createBrandService(req.body);
    res.status(200).json({
      status: 'success',
      message: 'Brand created successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not create brand',
      error: error.message,
    });
  }
};

exports.getbrands = async (req, res) => {
  try {
    const brands = await getBrandService();
    res.status(200).json({
      status: 'success',
      data: brands,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not get the brand',
      error: error.message,
    });
  }
};

exports.getBrandById = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await getBrandByIDService(id);
    if (!brand) {
      return res.status(400).json({
        status: 'fail',
        error: 'Could not get the brand by this id',
      });
    }

    res.status(200).json({
      status: 'success',
      data: brand,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not get the brand',
      error: error.message,
    });
  }
};

exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await updateBrandService(id, req.body);
    console.log(result);

    if (!result.modifiedCount) {
      return res.status(400).json({
        status: 'fail',
        error: 'Could not update the brand by this id',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Brand updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not update the brand',
      error: error.message,
    });
  }
};
