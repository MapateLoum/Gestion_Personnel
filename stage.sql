-- MySQL dump 10.13  Distrib 8.4.5, for Win64 (x86_64)
--
-- Host: localhost    Database: stage
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `absences`
--

DROP TABLE IF EXISTS `absences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `absences` (
  `MLE` varchar(50) NOT NULL,
  `SEM` varchar(50) DEFAULT NULL,
  `AA` int DEFAULT NULL,
  `MAL` int DEFAULT NULL,
  `SM` int DEFAULT NULL,
  `MP` int DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_ABSENCES_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `absences`
--

LOCK TABLES `absences` WRITE;
/*!40000 ALTER TABLE `absences` DISABLE KEYS */;
/*!40000 ALTER TABLE `absences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agents`
--

DROP TABLE IF EXISTS `agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agents` (
  `MLE` varchar(50) NOT NULL,
  `NOM` varchar(50) DEFAULT NULL,
  `PRENOM` varchar(50) DEFAULT NULL,
  `DEPT_DIV_SERV_SUBD` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_AGENTS_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agents`
--

LOCK TABLES `agents` WRITE;
/*!40000 ALTER TABLE `agents` DISABLE KEYS */;
/*!40000 ALTER TABLE `agents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_2008`
--

DROP TABLE IF EXISTS `base_2008`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_2008` (
  `MLE` varchar(50) NOT NULL,
  `NOM` varchar(50) DEFAULT NULL,
  `PRENOMS` varchar(50) DEFAULT NULL,
  `FONCTIN` varchar(50) DEFAULT NULL,
  `CAT` varchar(50) DEFAULT NULL,
  `SALAIRE` decimal(10,2) DEFAULT NULL,
  `SECTION` varchar(50) DEFAULT NULL,
  `SECTEUR` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_BASE_200_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_2008`
--

LOCK TABLES `base_2008` WRITE;
/*!40000 ALTER TABLE `base_2008` DISABLE KEYS */;
/*!40000 ALTER TABLE `base_2008` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bon_de_cde_lp`
--

DROP TABLE IF EXISTS `bon_de_cde_lp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bon_de_cde_lp` (
  `NUMCDE` varchar(50) NOT NULL,
  `CODE` varchar(50) DEFAULT NULL,
  `DATECDE` date DEFAULT NULL,
  `SECTION` varchar(50) DEFAULT NULL,
  `NATURE` varchar(50) DEFAULT NULL,
  `EFFECTIF` int DEFAULT NULL,
  `CAT` varchar(50) DEFAULT NULL,
  `DDEBUT` date DEFAULT NULL,
  `NBREJ` int DEFAULT NULL,
  `NBREH` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`NUMCDE`),
  KEY `FK_BON_DE_C_REFERENCE_NATURES_` (`CODE`),
  CONSTRAINT `FK_BON_DE_C_REFERENCE_NATURES_` FOREIGN KEY (`CODE`) REFERENCES `natures_lp` (`CODE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bon_de_cde_lp`
--

LOCK TABLES `bon_de_cde_lp` WRITE;
/*!40000 ALTER TABLE `bon_de_cde_lp` DISABLE KEYS */;
/*!40000 ALTER TABLE `bon_de_cde_lp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cadres_ams`
--

DROP TABLE IF EXISTS `cadres_ams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cadres_ams` (
  `MLE` varchar(50) NOT NULL,
  `NOM` varchar(50) DEFAULT NULL,
  `PRENOMS` varchar(50) DEFAULT NULL,
  `INTITULE_DU_POSTE` varchar(100) DEFAULT NULL,
  `CATEGORIE` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_CADRES_A_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cadres_ams`
--

LOCK TABLES `cadres_ams` WRITE;
/*!40000 ALTER TABLE `cadres_ams` DISABLE KEYS */;
/*!40000 ALTER TABLE `cadres_ams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories_lp`
--

DROP TABLE IF EXISTS `categories_lp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories_lp` (
  `CODECAT` varchar(50) NOT NULL,
  `PRIX` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`CODECAT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories_lp`
--

LOCK TABLES `categories_lp` WRITE;
/*!40000 ALTER TABLE `categories_lp` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories_lp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cdd2_cdi`
--

DROP TABLE IF EXISTS `cdd2_cdi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cdd2_cdi` (
  `MLE` varchar(50) NOT NULL,
  `CDD2` varchar(50) DEFAULT NULL,
  `CDI` varchar(50) DEFAULT NULL,
  `FINCDD2` date DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_CDD2_CDI_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cdd2_cdi`
--

LOCK TABLES `cdd2_cdi` WRITE;
/*!40000 ALTER TABLE `cdd2_cdi` DISABLE KEYS */;
INSERT INTO `cdd2_cdi` VALUES ('P5','2025-07-18',NULL,'2025-07-26');
/*!40000 ALTER TABLE `cdd2_cdi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `challenge_sec_99`
--

DROP TABLE IF EXISTS `challenge_sec_99`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challenge_sec_99` (
  `MLE` varchar(50) NOT NULL,
  `LOT` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_CHALLENG_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `challenge_sec_99`
--

LOCK TABLES `challenge_sec_99` WRITE;
/*!40000 ALTER TABLE `challenge_sec_99` DISABLE KEYS */;
/*!40000 ALTER TABLE `challenge_sec_99` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conges`
--

DROP TABLE IF EXISTS `conges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conges` (
  `REF` varchar(50) NOT NULL,
  `MLE` varchar(50) DEFAULT NULL,
  `DDRETOUR` date DEFAULT NULL,
  `DDEPART` date DEFAULT NULL,
  `NJMEDAILLE` int DEFAULT NULL,
  `RELIQT` varchar(50) DEFAULT NULL,
  `NJANC` int DEFAULT NULL,
  `INTERC` char(1) DEFAULT NULL,
  `SUPPF` char(1) DEFAULT NULL,
  `OBSERVATIONS` varchar(255) DEFAULT NULL,
  `DTA_RET_EFF` date DEFAULT NULL,
  PRIMARY KEY (`REF`),
  KEY `FK_CONGES_REFERENCE_PERS` (`MLE`),
  CONSTRAINT `FK_CONGES_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conges`
--

LOCK TABLES `conges` WRITE;
/*!40000 ALTER TABLE `conges` DISABLE KEYS */;
INSERT INTO `conges` VALUES ('CONGE-1752063053154','M3','2025-07-27','2025-07-09',14,'jjnn',2,'O','N','mzmzm',NULL),('CONGE-1752067770086','P5','2025-08-10','2025-07-31',2,'Relic',2,'O','N','Il peut partir',NULL);
/*!40000 ALTER TABLE `conges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrats`
--

DROP TABLE IF EXISTS `contrats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matricule` varchar(50) NOT NULL,
  `type_contrat` enum('Stage','CDD','CDI') NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `salaire` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contrats_matricule` (`matricule`),
  CONSTRAINT `fk_contrats_matricule` FOREIGN KEY (`matricule`) REFERENCES `pers` (`MLE`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrats`
--

LOCK TABLES `contrats` WRITE;
/*!40000 ALTER TABLE `contrats` DISABLE KEYS */;
INSERT INTO `contrats` VALUES (1,'P5','Stage','2025-07-03','2025-07-24',600000.00),(2,'M1','CDI','2025-07-18','2050-07-10',1000000.00),(3,'v','Stage','2025-07-03','2025-07-27',40000.00),(4,'M2','Stage','2025-07-11','2025-06-30',2354.00);
/*!40000 ALTER TABLE `contrats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enfants_cadre_ams`
--

DROP TABLE IF EXISTS `enfants_cadre_ams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enfants_cadre_ams` (
  `MLE` varchar(50) NOT NULL,
  `CAD_MLE` varchar(50) DEFAULT NULL,
  `ENFANTS` varchar(50) DEFAULT NULL,
  `D_N_ENF` date DEFAULT NULL,
  `L_N_ENF` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  KEY `FK_ENFANTS__REFERENCE_CADRES_A` (`CAD_MLE`),
  CONSTRAINT `FK_ENFANTS__REFERENCE_CADRES_A` FOREIGN KEY (`CAD_MLE`) REFERENCES `cadres_ams` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_ENFANTS__REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enfants_cadre_ams`
--

LOCK TABLES `enfants_cadre_ams` WRITE;
/*!40000 ALTER TABLE `enfants_cadre_ams` DISABLE KEYS */;
/*!40000 ALTER TABLE `enfants_cadre_ams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `epouses_cadre_ams`
--

DROP TABLE IF EXISTS `epouses_cadre_ams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `epouses_cadre_ams` (
  `MLE` varchar(50) NOT NULL,
  `EPOUSES` varchar(50) DEFAULT NULL,
  `D_N_EP` date DEFAULT NULL,
  `L_N_EP` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  KEY `FK_EPOUSES__REFERENCE_PERS` (`L_N_EP`),
  CONSTRAINT `FK_EPOUSES__REFERENCE_CADRES_A` FOREIGN KEY (`MLE`) REFERENCES `cadres_ams` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_EPOUSES__REFERENCE_PERS` FOREIGN KEY (`L_N_EP`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `epouses_cadre_ams`
--

LOCK TABLES `epouses_cadre_ams` WRITE;
/*!40000 ALTER TABLE `epouses_cadre_ams` DISABLE KEYS */;
/*!40000 ALTER TABLE `epouses_cadre_ams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fiche_pointage`
--

DROP TABLE IF EXISTS `fiche_pointage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fiche_pointage` (
  `NUMPOIN` varchar(50) NOT NULL,
  `DATEPOIN` date DEFAULT NULL,
  `NUMCDE` varchar(50) DEFAULT NULL,
  `SECTION` varchar(50) DEFAULT NULL,
  `CAT` varchar(50) DEFAULT NULL,
  `NHN` decimal(10,2) DEFAULT NULL,
  `NH12` decimal(10,2) DEFAULT NULL,
  `NH31` decimal(10,2) DEFAULT NULL,
  `NBREP` int DEFAULT NULL,
  PRIMARY KEY (`NUMPOIN`),
  KEY `FK_FICHE_PO_REFERENCE_SECTION_` (`SECTION`),
  KEY `FK_FICHE_PO_REFERENCE_CATEGORI` (`CAT`),
  CONSTRAINT `FK_FICHE_PO_REFERENCE_CATEGORI` FOREIGN KEY (`CAT`) REFERENCES `categories_lp` (`CODECAT`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_FICHE_PO_REFERENCE_SECTION_` FOREIGN KEY (`SECTION`) REFERENCES `section_et_budget` (`CODE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fiche_pointage`
--

LOCK TABLES `fiche_pointage` WRITE;
/*!40000 ALTER TABLE `fiche_pointage` DISABLE KEYS */;
/*!40000 ALTER TABLE `fiche_pointage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `immatriculation`
--

DROP TABLE IF EXISTS `immatriculation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `immatriculation` (
  `MLE` varchar(50) NOT NULL,
  `IPRES` varchar(50) DEFAULT NULL,
  `CSS` varchar(50) DEFAULT NULL,
  `CNI` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_IMMATRIC_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `immatriculation`
--

LOCK TABLES `immatriculation` WRITE;
/*!40000 ALTER TABLE `immatriculation` DISABLE KEYS */;
/*!40000 ALTER TABLE `immatriculation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `natures_lp`
--

DROP TABLE IF EXISTS `natures_lp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `natures_lp` (
  `CODE` varchar(50) NOT NULL,
  `LIBELLE` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `natures_lp`
--

LOCK TABLES `natures_lp` WRITE;
/*!40000 ALTER TABLE `natures_lp` DISABLE KEYS */;
/*!40000 ALTER TABLE `natures_lp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pers`
--

DROP TABLE IF EXISTS `pers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pers` (
  `STE` varchar(50) DEFAULT NULL,
  `CODE_SAN` varchar(50) DEFAULT NULL,
  `MLE` varchar(50) NOT NULL,
  `CODE` varchar(50) DEFAULT NULL,
  `NOM` varchar(50) DEFAULT NULL,
  `PRENOMS` varchar(50) DEFAULT NULL,
  `INTITULE_DU_POSE` varchar(100) DEFAULT NULL,
  `CODEPOSTE` varchar(50) DEFAULT NULL,
  `STAT` varchar(50) DEFAULT NULL,
  `CODSTAT` varchar(50) DEFAULT NULL,
  `CATEGORIE` varchar(50) DEFAULT NULL,
  `REG` varchar(50) DEFAULT NULL,
  `DATE_NAIS` date DEFAULT NULL,
  `DATE_EMB` date DEFAULT NULL,
  `DATE_DEP` date DEFAULT NULL,
  `SEXE` char(1) DEFAULT NULL,
  `NATION` varchar(50) DEFAULT NULL,
  `SF` varchar(50) DEFAULT NULL,
  `CONFESSION` varchar(50) DEFAULT NULL,
  `PELERINAGE` varchar(50) DEFAULT NULL,
  `NBEP` int DEFAULT NULL,
  `NBENF` int DEFAULT NULL,
  `BASE_HORAIRE` decimal(10,2) DEFAULT NULL,
  `DEPT_DIV_SERV_SUBD` varchar(100) DEFAULT NULL,
  `ADRESSE` varchar(255) DEFAULT NULL,
  `FILIATION_` varchar(100) DEFAULT NULL,
  `FILIATION_2` varchar(100) DEFAULT NULL,
  `LIEUNAIS` varchar(100) DEFAULT NULL,
  `LIEUTRAVAIL` varchar(100) DEFAULT NULL,
  `PHOTO` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  KEY `FK_PERS_REFERENCE_SECTION_` (`CODE`),
  CONSTRAINT `FK_PERS_REFERENCE_SECTION_` FOREIGN KEY (`CODE`) REFERENCES `section_et_budget` (`CODE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pers`
--

LOCK TABLES `pers` WRITE;
/*!40000 ALTER TABLE `pers` DISABLE KEYS */;
INSERT INTO `pers` VALUES (NULL,NULL,'12345','M',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('ics',NULL,'B002','M','zz','z',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('ICS',NULL,'M1',NULL,'Sarr','Adama','M3','M3','12','M3','M3','fonction publique','1999-08-26','2025-07-03',NULL,'M','Senegalaise','celibataire','Musulman','Non',0,0,40.00,'Direction','HLM','Mbaye','Penda','THIES','ICS',NULL),('ics','S123','M2',NULL,'loum',NULL,NULL,NULL,NULL,NULL,'b2',NULL,NULL,NULL,NULL,'M',NULL,NULL,'XXC',NULL,NULL,NULL,NULL,NULL,'hlm',NULL,NULL,NULL,NULL,NULL),('ics','S123','M3',NULL,'DIALLO',NULL,NULL,NULL,NULL,NULL,'b2',NULL,NULL,NULL,NULL,'M',NULL,NULL,'XXC',NULL,NULL,NULL,NULL,NULL,'hlm',NULL,NULL,NULL,NULL,NULL),('ICS',NULL,'M4','M','Ndiaye','Malick','Developpeur','123','M3','123','b2','Thies','2025-07-02','2025-07-25','2025-07-26','M','Senegalaise','celibataire','Musulman','Non',0,1,40.00,'Direction','HLM','Issa','Rokaya','THIES','ICS',NULL),('ics',NULL,'M5',NULL,'DIALLO','Aissatou','M3','M3','M3','M3','M3','fonction publique','2012-02-12','2025-07-02',NULL,'M','M3','M3','M3','M3',2,4,40.00,'inf','hlm','M3','M3','THIES','M3',NULL),('ICS',NULL,'MM','M',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,NULL,'P','z',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('ICS',NULL,'P5',NULL,'Loum','Papa Mapaté','DG',NULL,'Statut','C_Statu','A5','Thies','2003-05-16','2025-06-02',NULL,'M','Senegalaise','celibataire','Musulman','Non',0,0,35.00,'Direction','HLM','Issa','Rokaya','THIES','ICS',NULL),(NULL,NULL,'v','T',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,NULL,'X','M',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,NULL,'zz','z','zz','z',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pointage`
--

DROP TABLE IF EXISTS `pointage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pointage` (
  `REF` varchar(50) NOT NULL,
  `MLE` varchar(50) DEFAULT NULL,
  `SEMAINE` varchar(50) DEFAULT NULL,
  `NBREJTRAV` int DEFAULT NULL,
  `NBREJABS` int DEFAULT NULL,
  `NBREPP` int DEFAULT NULL,
  `NBREPAUSE` int DEFAULT NULL,
  `NBRE_HN` decimal(10,2) DEFAULT NULL,
  `NBRE_HM` decimal(10,2) DEFAULT NULL,
  `HN` decimal(10,2) DEFAULT NULL,
  `HS15` decimal(10,2) DEFAULT NULL,
  `HS40` decimal(10,2) DEFAULT NULL,
  `HS60` decimal(10,2) DEFAULT NULL,
  `HS100` decimal(10,2) DEFAULT NULL,
  `CP` int DEFAULT NULL,
  `AT` int DEFAULT NULL,
  `MP` int DEFAULT NULL,
  `SM` int DEFAULT NULL,
  `VM` int DEFAULT NULL,
  `AM` int DEFAULT NULL,
  `EF` int DEFAULT NULL,
  `AA` int DEFAULT NULL,
  PRIMARY KEY (`REF`),
  KEY `FK_POINTAGE_REFERENCE_PERS` (`MLE`),
  CONSTRAINT `FK_POINTAGE_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pointage`
--

LOCK TABLES `pointage` WRITE;
/*!40000 ALTER TABLE `pointage` DISABLE KEYS */;
/*!40000 ALTER TABLE `pointage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sal_categoriels_jn`
--

DROP TABLE IF EXISTS `sal_categoriels_jn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sal_categoriels_jn` (
  `MLE` varchar(50) NOT NULL,
  `CAT` varchar(50) DEFAULT NULL,
  `SAL_CONV` decimal(10,2) DEFAULT NULL,
  `HS` decimal(10,2) DEFAULT NULL,
  `SURSAL` decimal(10,2) DEFAULT NULL,
  `MINI_SAL` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_SAL_CATE_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_SAL_CATEGORIELS_JN_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sal_categoriels_jn`
--

LOCK TABLES `sal_categoriels_jn` WRITE;
/*!40000 ALTER TABLE `sal_categoriels_jn` DISABLE KEYS */;
/*!40000 ALTER TABLE `sal_categoriels_jn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sal_categoriels_postes`
--

DROP TABLE IF EXISTS `sal_categoriels_postes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sal_categoriels_postes` (
  `MLE` varchar(50) NOT NULL,
  `CAT` varchar(50) DEFAULT NULL,
  `SAL_CONV` decimal(10,2) DEFAULT NULL,
  `HS` decimal(10,2) DEFAULT NULL,
  `SURSAL` decimal(10,2) DEFAULT NULL,
  `MINI_SAL` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_SAL_CATEGORIELS_POSTES_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sal_categoriels_postes`
--

LOCK TABLES `sal_categoriels_postes` WRITE;
/*!40000 ALTER TABLE `sal_categoriels_postes` DISABLE KEYS */;
/*!40000 ALTER TABLE `sal_categoriels_postes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salaires_categoriels`
--

DROP TABLE IF EXISTS `salaires_categoriels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salaires_categoriels` (
  `MLE` varchar(50) NOT NULL,
  `CAT` varchar(50) DEFAULT NULL,
  `SALCON` decimal(10,2) DEFAULT NULL,
  `SALMINI` decimal(10,2) DEFAULT NULL,
  `AVALOIR` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`MLE`),
  CONSTRAINT `FK_SALAIRES_REFERENCE_PERS` FOREIGN KEY (`MLE`) REFERENCES `pers` (`MLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salaires_categoriels`
--

LOCK TABLES `salaires_categoriels` WRITE;
/*!40000 ALTER TABLE `salaires_categoriels` DISABLE KEYS */;
INSERT INTO `salaires_categoriels` VALUES ('P5','CategorieExemple',350000.00,300000.00,50000.00);
/*!40000 ALTER TABLE `salaires_categoriels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section_et_budget`
--

DROP TABLE IF EXISTS `section_et_budget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section_et_budget` (
  `CODE` char(1) NOT NULL,
  `INTITULE` varchar(255) DEFAULT NULL,
  `BUDGET` decimal(10,2) DEFAULT NULL,
  `MERT` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section_et_budget`
--

LOCK TABLES `section_et_budget` WRITE;
/*!40000 ALTER TABLE `section_et_budget` DISABLE KEYS */;
INSERT INTO `section_et_budget` VALUES ('G','TEST2',55400.00,72300.00),('M','ssss',3000.00,300.00),('T','TEST',5400.00,2300.00),('z','ssss',3000.00,300.00);
/*!40000 ALTER TABLE `section_et_budget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `matricule` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`matricule`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('M12','adama@gmail.com','Sarr','Adama','12345','2025-07-09 15:02:49'),('M2','loumpapamapate@gmail.com','loum','papa','123456','2025-07-09 11:15:24'),('M3','loumpapis@gmail.com','DIALLO','Aïssatou','12345','2025-07-09 11:16:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-11 13:13:30
