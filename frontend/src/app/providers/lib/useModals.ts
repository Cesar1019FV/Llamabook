import { useBoolean } from './useBoolean'

export function useModals() {
  const plusPopup = useBoolean(false)
  const modelPopup = useBoolean(false)
  const profileDropdown = useBoolean(false)
  const settingsModal = useBoolean(false)
  const createNotebookModal = useBoolean(false)
  const createAgentModal = useBoolean(false)
  const uploadPDFModal = useBoolean(false)

  const closePopups = () => {
    plusPopup.setFalse()
    modelPopup.setFalse()
    profileDropdown.setFalse()
    settingsModal.setFalse()
    createNotebookModal.setFalse()
    createAgentModal.setFalse()
    uploadPDFModal.setFalse()
  }

  return {
    plusPopupOpen: plusPopup.value,
    modelPopupOpen: modelPopup.value,
    profileDropdownOpen: profileDropdown.value,
    settingsModalOpen: settingsModal.value,
    createNotebookModalOpen: createNotebookModal.value,
    createAgentModalOpen: createAgentModal.value,
    uploadPDFModalOpen: uploadPDFModal.value,
    openPlusPopup: plusPopup.setTrue,
    closePlusPopup: plusPopup.setFalse,
    openModelPopup: modelPopup.setTrue,
    closeModelPopup: modelPopup.setFalse,
    openProfileDropdown: profileDropdown.setTrue,
    closeProfileDropdown: profileDropdown.setFalse,
    openSettingsModal: settingsModal.setTrue,
    closeSettingsModal: settingsModal.setFalse,
    openCreateNotebookModal: createNotebookModal.setTrue,
    closeCreateNotebookModal: createNotebookModal.setFalse,
    openCreateAgentModal: createAgentModal.setTrue,
    closeCreateAgentModal: createAgentModal.setFalse,
    openUploadPDFModal: uploadPDFModal.setTrue,
    closeUploadPDFModal: uploadPDFModal.setFalse,
    closePopups,
  }
}
