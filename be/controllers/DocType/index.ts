import express from 'express'
import * as docTypeController from './docTypeController'

let router = express.Router()

router.get('/', docTypeController.getDocTypes)
router.get('/:docTypeId', docTypeController.getDocType)
router.put('/', docTypeController.createDocType)
router.post('/:docTypeId', docTypeController.updateDocType)
router.post('/:docTypeId/link/:fieldId', docTypeController.linkFieldToDoc)

export default router