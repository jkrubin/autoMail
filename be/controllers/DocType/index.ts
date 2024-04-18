import express from 'express'
import * as docTypeController from './docTypeController'
import * as auth from '../Users/usersController'
let router = express.Router()
router.use(auth.authenticateTokenWithRoles(['USER']))
router.get('/', docTypeController.getDocTypes)
router.get('/:docTypeId', docTypeController.getDocType)
router.put('/', docTypeController.createDocType)
router.post('/:docTypeId', docTypeController.updateDocType)
router.post('/:docTypeId/link/:fieldId', docTypeController.linkFieldToDoc)

export default router