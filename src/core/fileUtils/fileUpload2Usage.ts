/**
 * 文件上传场景（FileUpload2）枚举
 */

/** 文件上传的业务场景编码 */
export enum FileUpload2BusiScene {
  CYCM_BUSINESS_ACTIVITIES = 'c_1',
  CYCM_SUPPLIER_EVAL_REC_REPORT_IMG = 'c_2',
  CYCM_SUPPLIER_EVAL_REC_ON_SITE_MEDIA = 'c_3',
  CYCM_ESULT_REC_DETECT_BUSINESS_LICENSE = 'c_4',
  CYCM_RESULT_REC_DETECT_QUALIFICATION = 'c_5',
  CYCM_RESULT_REC_TEST_RESULT = 'c_6',
  CYCM_LEFT_SAMPLE_REC_FOOD_IMG = 'c_7',
  CYCM_PEST_CONTROL_PROCESS_IMG = 'c_8',
  CYCM_PRODUCTION_FEED_IMG = 'c_9',
  CYCM_FOOD_DISH_DISINFECT_IMG = 'c_10',
  CYCM_WATER_TEST_RESULT_ATTACH = 'c_11',
  CYCM_OUT_PRODUCTION_TEST_RESULT_ATTACH = 'c_12',
  CYCM_AIR_QUALITY_MONITOR_OTHER_ATTACH = 'c_13',
  CYCM_PRINCIPAL_DUTY_RECORD = 'c_14',
  CYCM_PRINCIPAL_DUTY_RECORD_OTHER_ATTACH = 'c_15',
  CYCM_FEATURE_DISH_IMG = 'c_16',
  CYCM_LEARNING_SPACE_TRAINING = 'c_17',
  CYCM_LEARNING_SPACE_SALES_RECORD = 'c_18',
  CYCM_TRANSPORT_CARRIER_QUALIFICATION = 'c_19',
  CYCM_SAMPLE_TEST_RESULT_ATTACH = 'c_20',
  CYCM_STOCK_CONVERT_ATTACH = 'c_21',
  CYCM_SAFETY_RISK_SCENE_RECORD = 'c_22',
  CYCM_GARBAGE_HANDLING_SIGN = 'c_23',
  CYCM_GARBAGE_HANDLING_RECEIVE_SIGN = 'c_24',
  CYCM_GARBAGE_HANDLING_TRANSFER_SIGN = 'c_25',
  CYCM_DELEGATE_PRODUCTION_CONTRACT = 'c_26',
  CYCM_DELEGATE_PRODUCTION_BUSINESS_LICENSE = 'c_27',
  CYCM_DELEGATE_PRODUCTION_TRUSTEE_BUSINESS_LICENSE = 'c_28',
  CYCM_PUBLICITY_BAR_IMG = 'c_29',
  CYCM_PRODUCTION_SUPERVISION_SIGN = 'c_30',
  CYCM_PRODUCTION_SUPERVISION_TRUSTEE_SIGN = 'c_31',
  CYCM_PRODUCTION_SUPERVISION_RELATED_PROOF = 'c_32',
  CYCM_ADDITIVE_USE_SIGN = 'c_33',
  CYCM_ADDITIVE_USE_REVIEW_SIGN = 'c_34',
  CYCM_UNQUALIFIED_DISPOSAL_RECORD_RELATED_PROOF = 'c_35',
  CYCM_RECALL_DISPOSAL_RECORD_NOTICE_ATTACH = 'c_36',
  CYCM_RECALL_DISPOSAL_RECORD_PROOF = 'c_37',
  CYCM_FOOD_TRACE_RECORD = 'c_38',
  CYCM_STOCK_CONVERT_RECORD_BUSINESS_LICENSE = 'c_39',
  CYCM_EQUIPMENT_MAINTENANCE_RECORD_IMG = 'c_40',
  CYCM_MENU_IMG = 'c_41',
  CYCM_HAND_IMG = 'c_42',
  CYCM_VIDEO_INSPECTION_RECORD_VIDEO = 'c_43',
  CYCM_ACCOMPANY_MEALS_IMG = '23_0',
  CYCM_EVIDENTIARY_IMG = 'c_47',
  CYCM_MATERIALS_VIDEO = 'c_48',
  CYCM_MATERIALS_OUT_STOCK_BILL = 'c_49',
  YXSC_PHARMACIST_IMG = 'y_1',
  YXSC_DEVICE_IMG = 'q_2',
  YXSC_PURCHASE_VOUCHER = 'q_3'
}

/** 企业服务的文件用途编码 */
export enum JyfwFileUpload2Usage {
  NORMAL = 'f0',
  QYFW_ASSIST = 'f1',
  QYFW_STANDARD = 'f1_1',
  THEME = 'f2',
  PUBLIC = 'f3',
  APP_RESOURCE = 'f4',
  DATA_IMPORT = 'f5',
  AUTH_INFO = 'f6',
  STOCK = 'f7',
  RICH_TEXT = 'f8',
  RICH_TEXT_APP = 'f8_1',
  RICH_TEXT_OCR = 'f8_2',
  LEARNING_SPACE = 'f9_1',
  LEARNING_SPACE2 = 'f9_2',
  LEARNING_SPACE3 = 'f9_3',
  OPEN_IM = 'f0_1',
  BUILDING_IMAGE = 'f11_1',
  BUILDING_BUSINESS_LICENSE = 'f11_2',
  SERVICE_VISIT = 'f11_3',
  PUBLISH_RENT = 'f11_4',
  TEXT_ATTACHMENT = 'c1',
  MODEL_SERVICE_BACKGROUND = 'bot',
  JYFW_WORK_ATTACHMENT = 'f12',
  SCZY_DYWS_FJ = 'f13_1'
}

export enum JyfwEnumBusiType {}

/** 定义业务类型枚举 */
export enum CycmEnumBusiType {
  Enterprise = 1,
  Store = 2,
  Task = 3,
  License = 4,
  StaffCertification = 5,
  Regulation = 6,
  Personnel = 7,
  PurchaseRecord = 8,
  Inspection = 9,
  Service = 10,
  Activity = 11,
  NoticeAnnouncement = 12,
  LawRegulation = 13,
  KnowledgeBase = 14,
  QuestionConsultation = 15,
  Application = 16,
  PublicOpinion = 17,
  PreparationReview = 18,
  SmartWorkOrder = 19,
  FoodSampleSign = 21
}

/** 文件类型 */
export enum CycmEnumFileType {
  Shop = 0,
  License = 1,
  ShopImage = 2,
  SupplierLicense = 3,
  AuditResult = 4,
  MerchantSubmissionDocumentation = 5,
  Facilities = 6,
  BusinessCategory = 7,
  SupplierLicenseDocumentation = 8,
  ProductCertificationDocumentation = 9,
  IdentityDocumentation = 10,
  RoughSource = 11,
  WashZoneSource = 12,
  SpecialZone = 13,
  PurchaseInspectionRecord = 14,
  Menu = 15,
  GuidanceVideo = 16,
  IdentityDocumentationReverse = 17,
  PowerOfAttorney = 18,
  NotLimitedPersonnel = 19,
  LegalUse = 20,
  PlaneLayout = 21,
  OrientationMap = 22,
  NucleicAcidTesting = 23,
  Attachment = 24,
  Signature = 25,
  SupervisionCheckPdf = 26,
  PersonnelPhoto = 27,
  UnderageSaleOfAlcohol = 28,
  ContractFile1 = 29,
  ContractFile2 = 30,
  SmartEvidence = 31,
  SmartResult = 32,
  VideoInspection = 33,
  Others = 99
}

/** 合并 CycmEnumFileType 和 JyfwFileUpload2Usage 的文件用途表 */
const fileUpload2Usage: typeof JyfwFileUpload2Usage & typeof CycmEnumFileType = {
  ...JyfwFileUpload2Usage,
  ...CycmEnumFileType
};

export default fileUpload2Usage;

/** 使用的文件类型 */
export type IFileUpload2UsageType = JyfwFileUpload2Usage | CycmEnumFileType;
export type IFileUpload2BusiSceneType = FileUpload2BusiScene;
/** cycm 的业务类型 */
export type IEnumBusiType = CycmEnumBusiType | JyfwEnumBusiType;
