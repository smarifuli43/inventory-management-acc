const {
  createSupplierService,
  getSuppliersService,
  getSupplierByIdService,
  updateSupplierService,
} = require('../services/supplier.services');

exports.createSupplier = async (req, res) => {
  try {
    const result = await createSupplierService(req.body);
    res.status(200).json({
      status: 'success',
      message: 'supplier created successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not create supplier',
      error: error.message,
    });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await getSuppliersService();
    res.status(200).json({
      status: 'success',
      data: suppliers,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not get the supplier',
      error: error.message,
    });
  }
};

exports.getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await getSupplierByIdService(id);
    if (!supplier) {
      return res.status(400).json({
        status: 'fail',
        error: 'Could not get the supplier by this id',
      });
    }

    res.status(200).json({
      status: 'success',
      data: supplier,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not get the supplier',
      error: error.message,
    });
  }
};

exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await updateSupplierService(id, req.body);
    console.log(result);

    if (!result.modifiedCount) {
      return res.status(400).json({
        status: 'fail',
        error: 'Could not update the supplier by this id',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Supplier updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not update the Supplier',
      error: error.message,
    });
  }
};
