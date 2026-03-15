import wasteReportService from '../services/wasteReportService.js';

const getAll = async (req, res, next) => {
  try {
    const reports = await wasteReportService.getAllReports();
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const report = await wasteReportService.getReportById(req.params.id);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

const getByProduct = async (req, res, next) => {
  try {
    const reports = await wasteReportService.getReportsByProduct(req.params.productId);
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const report = await wasteReportService.createReport(req.body);
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await wasteReportService.updateReport(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await wasteReportService.deleteReport(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export default { getAll, getById, getByProduct, create, update, remove };
