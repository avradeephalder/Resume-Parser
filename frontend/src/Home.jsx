"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import styled from "styled-components"

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const BackgroundMesh = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 15% 30%, rgba(10, 132, 255, 0.25) 0%, transparent 40%),
    radial-gradient(circle at 85% 70%, rgba(0, 245, 212, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(10, 132, 255, 0.15) 0%, transparent 45%);
  background-size: 150% 150%;
  animation: meshFlow 20s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;

  @keyframes meshFlow {
    0% { background-position: 0% 0%, 100% 100%, 50% 50%, 0% 100%; }
    25% { background-position: 50% 30%, 50% 70%, 80% 30%, 30% 50%; }
    50% { background-position: 100% 0%, 0% 100%, 30% 80%, 100% 0%; }
    75% { background-position: 50% 70%, 50% 30%, 70% 50%, 70% 50%; }
    100% { background-position: 0% 0%, 100% 100%, 50% 50%, 0% 100%; }
  }
`

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0a0e27;
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
  position: relative;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;

  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(10, 132, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(10, 132, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 1;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
`

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 40px;
  gap: 60px;
  position: relative;

  @media (max-width: 1024px) {
    flex-direction: column;
    justify-content: center;
    gap: 40px;
    padding: 60px 30px;
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
    gap: 30px;
  }
`

const HeroContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: slideInLeft 1s ease-out;

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 1024px) {
    text-align: center;
  }
`

const HeroHeadline = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  margin: 0 0 20px 0;
  line-height: 1.1;
  background: linear-gradient(135deg, #00f5d4 0%, #0a84ff 50%, #8b5ce6 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientFlow 6s ease infinite;

  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 1.5vw, 1.1rem);
  color: #b4b4d1;
  line-height: 1.7;
  margin: 0 0 30px 0;
  max-width: 550px;
  animation: fadeInUp 1s ease-out 0.2s both;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1024px) {
    margin-left: auto;
    margin-right: auto;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  animation: fadeInUp 1s ease-out 0.4s both;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const PrimaryButton = styled.button`
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  color: #0a0e27;
  background: linear-gradient(135deg, #00f5d4 0%, #0a84ff 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 245, 212, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 40px rgba(0, 245, 212, 0.4);

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`

const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  color: #00f5d4;
  border: 2px solid #00f5d4;
  box-shadow: none;

  &:hover {
    background: rgba(0, 245, 212, 0.1);
    box-shadow: 0 0 20px rgba(0, 245, 212, 0.3);
  }
`

const HeroVisual = styled.div`
  flex: 1;
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slideInRight 1s ease-out;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 1024px) {
    display: none;
  }
`

const FloatingCard = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: ${(props) => props.$animation || "float 6s ease-in-out infinite"};

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes floatAlt {
    0%, 100% { transform: translateY(0px) rotateZ(-2deg); }
    50% { transform: translateY(-15px) rotateZ(2deg); }
  }

  @keyframes floatAlt2 {
    0%, 100% { transform: translateY(0px) rotateZ(2deg); }
    50% { transform: translateY(-25px) rotateZ(-2deg); }
  }

  ${(props) => {
    switch (props.$position) {
      case 1:
        return `
          top: 20px;
          left: 0;
          width: 200px;
          animation: floatAlt 7s ease-in-out infinite;
        `
      case 2:
        return `
          top: 60%;
          right: 0;
          width: 180px;
          animation: floatAlt2 8s ease-in-out infinite;
        `
      case 3:
        return `
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          animation: float 6s ease-in-out infinite;
        `
      default:
        return ""
    }
  }}
`

const CardIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 12px;
`

const CardText = styled.p`
  font-size: 0.9rem;
  color: #b4b4d1;
  margin: 0;
  line-height: 1.4;
`

const UploadSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  position: relative;

  @media (max-width: 1024px) {
    padding: 60px 30px;
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
    min-height: auto;
  }
`

const UploadContainer = styled.div`
  max-width: 800px;
  width: 100%;
  animation: fadeIn 0.8s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const UploadCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(10, 132, 255, 0.2);
  border-radius: 20px;
  padding: 60px 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 0% 0%, rgba(0, 245, 212, 0.05) 0%, transparent 50%);
    animation: shimmer 8s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes shimmer {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(50px, 50px); }
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: 16px;
  }
`

const UploadTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #00f5d4 0%, #0a84ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const UploadDescription = styled.p`
  font-size: 0.95rem;
  color: #b4b4d1;
  margin: 0 0 30px 0;
  line-height: 1.6;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
`

const DropZone = styled.div`
  border: 2px dashed ${(props) => (props.$isDragActive ? "#00f5d4" : "rgba(10, 132, 255, 0.4)")};
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.$isDragActive ? "rgba(0, 245, 212, 0.08)" : "transparent")};
  margin-bottom: 30px;
  position: relative;
  z-index: 1;

  &:hover {
    border-color: #00f5d4;
    background: rgba(0, 245, 212, 0.05);
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`

const UploadIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 2.5s ease-in-out infinite;

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
`

const DropZoneText = styled.p`
  font-size: 1.1rem;
  color: #b4b4d1;
  margin: 0;
  font-weight: 500;
`

const FileInput = styled.input`
  display: none;
`

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 30px 0;
  position: relative;
  z-index: 1;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(10, 132, 255, 0.2);
  }
`

const OrText = styled.span`
  color: #9ca3af;
  font-size: 0.9rem;
`

const UploadLink = styled.button`
  background: transparent;
  border: none;
  color: #0a84ff;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  z-index: 1;
  width: 100%;
  text-align: center;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #0a84ff, #00f5d4);
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`

const FilePreview = styled.div`
  background: rgba(0, 245, 212, 0.08);
  border: 1px solid rgba(0, 245, 212, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideInDown 0.4s ease-out;
  position: relative;
  z-index: 1;

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const FileName = styled.span`
  color: #00f5d4;
  font-weight: 500;
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 8px;
`

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0;
  margin-left: 12px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff6b6b;
    transform: scale(1.3) rotate(90deg);
  }
`

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 16px;
  border-radius: 12px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
  font-size: 0.95rem;
`

const LoadingSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  animation: fadeIn 0.6s ease-out;
`

const LoadingCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(10, 132, 255, 0.2);
  border-radius: 20px;
  padding: 80px 60px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 50px 30px;
  }
`

const ScannerDocument = styled.div`
  position: relative;
  width: 100px;
  height: 130px;
  margin: 0 auto 40px;
  display: inline-block;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid rgba(10, 132, 255, 0.5);
    border-radius: 8px;
    box-shadow: inset 0 0 20px rgba(0, 245, 212, 0.2);
  }

  &::after {
    content: '';
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #00f5d4, transparent);
    animation: scanLine 2s ease-in-out infinite;
    box-shadow: 0 0 10px #00f5d4;
  }

  @keyframes scanLine {
    0% { top: -20px; }
    50% { top: 50%; }
    100% { top: calc(100% + 20px); }
  }
`

const LoadingText = styled.p`
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px 0;
  min-height: 32px;
`

const LoadingDot = styled.span`
  display: inline-block;
  animation: ${(props) => `blink 1.4s infinite ${props.$delay}`};

  @keyframes blink {
    0%, 60%, 100% { opacity: 0.3; }
    30% { opacity: 1; }
  }
`

const LoadingSubtext = styled.p`
  color: #b4b4d1;
  font-size: 0.95rem;
  margin: 0;
`

const ResultsSection = styled.section`
  min-height: 100vh;
  padding: 100px 40px;
  animation: slideUp 0.8s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1024px) {
    padding: 60px 30px;
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
`

const ResultsTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #00f5d4 0%, #0a84ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`

const ResultsSubtitle = styled.p`
  font-size: 1.05rem;
  color: #b4b4d1;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const ResultsGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 60px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(10, 132, 255, 0.15);
  border-radius: 16px;
  padding: 32px;
  animation: ${(props) => `fadeInCard 0.6s ease-out ${props.$delay}s both`};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 245, 212, 0.1), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(0, 245, 212, 0.3);
    transform: translateY(-8px);

    &::before {
      left: 100%;
    }
  }

  @keyframes fadeInCard {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`

const CardTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: #00f5d4;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
`

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const InfoLabel = styled.span`
  color: #9ca3af;
  font-weight: 500;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoValue = styled.span`
  color: #ffffff;
  font-weight: 500;
  word-break: break-all;
`

const ProfileLink = styled.a`
  color: #0a84ff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #00f5d4;
  }
`

const SkillsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  position: relative;
  z-index: 1;
`

const SkillBadge = styled.span`
  background: linear-gradient(135deg, rgba(0, 245, 212, 0.2) 0%, rgba(10, 132, 255, 0.1) 100%);
  color: #00f5d4;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(0, 245, 212, 0.3);
  animation: ${(props) => `popIn 0.4s ease-out ${props.$delay}s both`};
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 245, 212, 0.3) 0%, rgba(10, 132, 255, 0.2) 100%);
    transform: scale(1.08);
    box-shadow: 0 0 15px rgba(0, 245, 212, 0.3);
  }

  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
`

const TimelineEntry = styled.div`
  padding: 16px;
  background: rgba(10, 132, 255, 0.05);
  border-left: 3px solid #0a84ff;
  border-radius: 6px;
  transition: all 0.3s ease;
  animation: ${(props) => `slideInLeft 0.5s ease-out ${props.$delay}s both`};

  &:hover {
    background: rgba(10, 132, 255, 0.1);
    border-left-color: #00f5d4;
    padding-left: 20px;
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`

const TimelineTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #ffffff;
`

const TimelineOrg = styled.p`
  font-size: 0.85rem;
  color: #00f5d4;
  margin: 0 0 6px 0;
  font-weight: 500;
`

const TimelinePeriod = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
`

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 80px;

  @media (max-width: 768px) {
    margin-top: 50px;
  }
`

// ============================================================================
// API & DATA TRANSFORM
// ============================================================================

const API_BASE_URL = "http://localhost:5000/api"

async function uploadResumeToBackend(file) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/resumes/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || "Failed to parse resume")
  }

  return response.json()
}

function transformBackendData(jsonResume) {
  const location = jsonResume?.basics?.location
  const locationStr = typeof location === "string" 
    ? location 
    : location?.city || location?.region || "N/A"

  return {
    contact: {
      name: jsonResume?.basics?.name || "N/A",
      email: jsonResume?.basics?.email || "N/A",
      phone: jsonResume?.basics?.phone || "N/A",
      location: locationStr,
      website: jsonResume?.basics?.website || null,
      profiles: jsonResume?.basics?.profiles || []
    },
    summary: jsonResume?.basics?.summary || "No summary available",
    skills: (jsonResume?.skills || []).flatMap(s => s.keywords || []),
    experience: (jsonResume?.work || []).map((w) => ({
      title: w?.position || "N/A",
      company: w?.name || "N/A",
      location: w?.location || null,
      period: [w?.startDate || "", w?.endDate || "Present"]
        .filter(Boolean)
        .join(" - ") || "N/A",
      highlights: w?.highlights || []
    })),
    education: (jsonResume?.education || []).map((e) => ({
      degree: [e?.studyType || "", e?.area || ""]
        .filter(Boolean)
        .join(" in ") || "N/A",
      school: e?.institution || "N/A",
      year: e?.endDate || e?.date || "N/A",
      score: e?.score || null
    })),
    projects: jsonResume?.projects || [],
    certificates: jsonResume?.certificates || [],
    languages: jsonResume?.languages || [],
    awards: jsonResume?.awards || [],
    volunteer: jsonResume?.volunteer || []
  }
}

// ============================================================================
// HOME COMPONENT
// ============================================================================

export default function Home() {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const [error, setError] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const fileInputRef = useRef(null)
  const uploadSectionRef = useRef(null)

  const stages = ["Analyzing Resume", "Extracting Skills", "Parsing Experience", "Processing Education"]

  useEffect(() => {
    if (!isLoading) return

    let stageIndex = 0
    const stageTimer = setInterval(() => {
      stageIndex = (stageIndex + 1) % stages.length
      setLoadingStage(stageIndex)
    }, 1000)

    return () => {
      clearInterval(stageTimer)
    }
  }, [isLoading])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setError(null)
      } else {
        setError("Please upload a PDF file")
      }
    }
  }, [])

  const handleFileSelect = useCallback((e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please upload a PDF file")
      }
    }
  }, [])

  const scrollToUpload = useCallback(() => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const jsonResume = await uploadResumeToBackend(file)
      const transformedData = transformBackendData(jsonResume)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setParsedData(transformedData)
      setFile(null)
    } catch (err) {
      setError(err.message || "Failed to parse resume. Please check your OpenAI API key.")
      console.error("Parse error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [file])

  const handleReset = useCallback(() => {
    setFile(null)
    setIsLoading(false)
    setParsedData(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <AppContainer>
        <BackgroundMesh />
        <ContentWrapper>
          <LoadingSection>
            <LoadingCard>
              <ScannerDocument />
              <LoadingText>
                {stages[loadingStage]}
                <LoadingDot $delay="0s">.</LoadingDot>
                <LoadingDot $delay="0.2s">.</LoadingDot>
                <LoadingDot $delay="0.4s">.</LoadingDot>
              </LoadingText>
              <LoadingSubtext>Processing your resume with OpenAI...</LoadingSubtext>
            </LoadingCard>
          </LoadingSection>
        </ContentWrapper>
      </AppContainer>
    )
  }

  // Results state
  if (parsedData) {
    return (
      <AppContainer>
        <BackgroundMesh />
        <ContentWrapper>
          <ResultsSection>
            <ResultsHeader>
              <ResultsTitle>Analysis Complete</ResultsTitle>
              <ResultsSubtitle>Your resume has been analyzed by OpenAI GPT-3.5.</ResultsSubtitle>
            </ResultsHeader>

            <ResultsGrid>
              {/* Contact Info */}
              <ResultCard $delay={0}>
                <CardTitle>Contact Info</CardTitle>
                <ContactInfo>
                  <InfoItem>
                    <InfoLabel>Full Name</InfoLabel>
                    <InfoValue>{parsedData.contact.name}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{parsedData.contact.email}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Phone</InfoLabel>
                    <InfoValue>{parsedData.contact.phone}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Location</InfoLabel>
                    <InfoValue>{parsedData.contact.location}</InfoValue>
                  </InfoItem>
                  {parsedData.contact.website && (
                    <InfoItem>
                      <InfoLabel>Website</InfoLabel>
                      <InfoValue>
                        <ProfileLink href={parsedData.contact.website} target="_blank" rel="noopener noreferrer">
                          {parsedData.contact.website}
                        </ProfileLink>
                      </InfoValue>
                    </InfoItem>
                  )}
                  {parsedData.contact.profiles.length > 0 && parsedData.contact.profiles.map((profile, idx) => (
                    <InfoItem key={idx}>
                      <InfoLabel>{profile.network}</InfoLabel>
                      <InfoValue>
                        <ProfileLink href={profile.url} target="_blank" rel="noopener noreferrer">
                          {profile.url}
                        </ProfileLink>
                      </InfoValue>
                    </InfoItem>
                  ))}
                </ContactInfo>
              </ResultCard>

              {/* Skills */}
              <ResultCard $delay={0.1}>
                <CardTitle>Core Skills</CardTitle>
                <SkillsGrid>
                  {parsedData.skills.length > 0 ? (
                    parsedData.skills.map((skill, idx) => (
                      <SkillBadge key={idx} $delay={0.2 + idx * 0.04}>
                        {skill}
                      </SkillBadge>
                    ))
                  ) : (
                    <InfoValue>No skills extracted</InfoValue>
                  )}
                </SkillsGrid>
              </ResultCard>

              {/* Experience */}
              <ResultCard $delay={0.2}>
                <CardTitle>Professional Experience</CardTitle>
                <Timeline>
                  {parsedData.experience.length > 0 ? (
                    parsedData.experience.map((exp, idx) => (
                      <TimelineEntry key={idx} $delay={0.3 + idx * 0.1}>
                        <TimelineTitle>{exp.title}</TimelineTitle>
                        <TimelineOrg>{exp.company}</TimelineOrg>
                        {exp.location && <TimelinePeriod>{exp.location}</TimelinePeriod>}
                        <TimelinePeriod>{exp.period}</TimelinePeriod>
                        {exp.highlights.length > 0 && (
                          <ul style={{marginTop: '8px', paddingLeft: '20px', color: '#b4b4d1', fontSize: '0.85rem'}}>
                            {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
                          </ul>
                        )}
                      </TimelineEntry>
                    ))
                  ) : (
                    <TimelineEntry>
                      <TimelineTitle>No experience found</TimelineTitle>
                    </TimelineEntry>
                  )}
                </Timeline>
              </ResultCard>

              {/* Education */}
              <ResultCard $delay={0.3}>
                <CardTitle>Education</CardTitle>
                <Timeline>
                  {parsedData.education.length > 0 ? (
                    parsedData.education.map((edu, idx) => (
                      <TimelineEntry key={idx} $delay={0.4 + idx * 0.1}>
                        <TimelineTitle>{edu.degree}</TimelineTitle>
                        <TimelineOrg>{edu.school}</TimelineOrg>
                        <TimelinePeriod>{edu.year}</TimelinePeriod>
                        {edu.score && <TimelinePeriod>{edu.score}</TimelinePeriod>}
                      </TimelineEntry>
                    ))
                  ) : (
                    <TimelineEntry>
                      <TimelineTitle>No education found</TimelineTitle>
                    </TimelineEntry>
                  )}
                </Timeline>
              </ResultCard>

              {/* Projects */}
              {parsedData.projects && parsedData.projects.length > 0 && (
                <ResultCard $delay={0.4}>
                  <CardTitle>Projects</CardTitle>
                  <Timeline>
                    {parsedData.projects.map((project, idx) => (
                      <TimelineEntry key={idx} $delay={0.5 + idx * 0.1}>
                        <TimelineTitle>{project.name}</TimelineTitle>
                        {project.description && <TimelineOrg>{project.description}</TimelineOrg>}
                        {project.highlights && project.highlights.length > 0 && (
                          <ul style={{marginTop: '8px', paddingLeft: '20px', color: '#b4b4d1', fontSize: '0.85rem'}}>
                            {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
                          </ul>
                        )}
                        {project.keywords && project.keywords.length > 0 && (
                          <SkillsGrid style={{marginTop: '12px'}}>
                            {project.keywords.map((tech, i) => (
                              <SkillBadge key={i} $delay={0}>{tech}</SkillBadge>
                            ))}
                          </SkillsGrid>
                        )}
                      </TimelineEntry>
                    ))}
                  </Timeline>
                </ResultCard>
              )}

              {/* Certifications */}
              {parsedData.certificates && parsedData.certificates.length > 0 && (
                <ResultCard $delay={0.5}>
                  <CardTitle>Certifications</CardTitle>
                  <Timeline>
                    {parsedData.certificates.map((cert, idx) => (
                      <TimelineEntry key={idx} $delay={0.6 + idx * 0.1}>
                        <TimelineTitle>{cert.name}</TimelineTitle>
                        {cert.issuer && <TimelineOrg>{cert.issuer}</TimelineOrg>}
                        {cert.date && <TimelinePeriod>{cert.date}</TimelinePeriod>}
                      </TimelineEntry>
                    ))}
                  </Timeline>
                </ResultCard>
              )}

              {/* Languages */}
              {parsedData.languages && parsedData.languages.length > 0 && (
                <ResultCard $delay={0.6}>
                  <CardTitle>Languages</CardTitle>
                  <SkillsGrid>
                    {parsedData.languages.map((lang, idx) => (
                      <SkillBadge key={idx} $delay={0.2 + idx * 0.04}>
                        {lang.language} ({lang.fluency})
                      </SkillBadge>
                    ))}
                  </SkillsGrid>
                </ResultCard>
              )}

              {/* Awards */}
              {parsedData.awards && parsedData.awards.length > 0 && (
                <ResultCard $delay={0.7}>
                  <CardTitle>Awards & Honors</CardTitle>
                  <Timeline>
                    {parsedData.awards.map((award, idx) => (
                      <TimelineEntry key={idx} $delay={0.8 + idx * 0.1}>
                        <TimelineTitle>{award.title}</TimelineTitle>
                        {award.awarder && <TimelineOrg>{award.awarder}</TimelineOrg>}
                        {award.date && <TimelinePeriod>{award.date}</TimelinePeriod>}
                      </TimelineEntry>
                    ))}
                  </Timeline>
                </ResultCard>
              )}

              {/* Volunteer */}
              {parsedData.volunteer && parsedData.volunteer.length > 0 && (
                <ResultCard $delay={0.8}>
                  <CardTitle>Volunteer Work</CardTitle>
                  <Timeline>
                    {parsedData.volunteer.map((vol, idx) => (
                      <TimelineEntry key={idx} $delay={0.9 + idx * 0.1}>
                        <TimelineTitle>{vol.position}</TimelineTitle>
                        <TimelineOrg>{vol.organization}</TimelineOrg>
                        {vol.startDate && vol.endDate && (
                          <TimelinePeriod>{vol.startDate} - {vol.endDate}</TimelinePeriod>
                        )}
                      </TimelineEntry>
                    ))}
                  </Timeline>
                </ResultCard>
              )}
            </ResultsGrid>

            <ActionContainer>
              <PrimaryButton onClick={handleReset}>Parse Another Resume</PrimaryButton>
            </ActionContainer>
          </ResultsSection>
        </ContentWrapper>
      </AppContainer>
    )
  }

  // Default state: Hero + Upload
  return (
    <AppContainer>
      <BackgroundMesh />
      <ContentWrapper>
        <HeroSection>
          <HeroContent>
            <HeroHeadline>AI Resume Parser</HeroHeadline>
            <HeroSubtitle>
              Unlock the full potential of your resume with intelligent analysis powered by OpenAI GPT-3.5.
              Extract key insights, validate skills, and get comprehensive parsing in seconds.
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton onClick={scrollToUpload}>Start Analysis</PrimaryButton>
              <SecondaryButton onClick={scrollToUpload}>Learn More</SecondaryButton>
            </ButtonGroup>
          </HeroContent>

          <HeroVisual>
            <FloatingCard $position={1}>
              <CardIcon>⚡</CardIcon>
              <CardText>Instant Analysis</CardText>
            </FloatingCard>
            <FloatingCard $position={2}>
              <CardIcon>🎯</CardIcon>
              <CardText>Skill Matching</CardText>
            </FloatingCard>
            <FloatingCard $position={3}>
              <CardIcon>📊</CardIcon>
              <CardText>Smart Insights</CardText>
            </FloatingCard>
          </HeroVisual>
        </HeroSection>

        <UploadSection ref={uploadSectionRef}>
          <UploadContainer>
            <UploadCard>
              <UploadTitle>Upload Your Resume</UploadTitle>
              <UploadDescription>
                Drop your PDF file here or browse your computer. Powered by OpenAI GPT-3.5 for high-accuracy extraction.
              </UploadDescription>

              {file ? (
                <FilePreview>
                  <FileName>✓ {file.name}</FileName>
                  <ClearButton onClick={() => setFile(null)} aria-label="Remove file">
                    ✕
                  </ClearButton>
                </FilePreview>
              ) : (
                <>
                  <DropZone
                    $isDragActive={isDragActive}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadIcon>📄</UploadIcon>
                    <DropZoneText>Drag & Drop Your Resume Here</DropZoneText>
                  </DropZone>

                  <OrDivider>
                    <OrText>or</OrText>
                  </OrDivider>

                  <UploadLink onClick={() => fileInputRef.current?.click()}>Browse Files</UploadLink>
                </>
              )}

              <FileInput
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                aria-label="Upload resume file"
              />

              <PrimaryButton
                onClick={handleAnalyze}
                disabled={!file}
                style={{ marginTop: "30px", width: "100%" }}
              >
                Analyze Resume with AI
              </PrimaryButton>

              {error && <ErrorMessage>{error}</ErrorMessage>}
            </UploadCard>
          </UploadContainer>
        </UploadSection>
      </ContentWrapper>
    </AppContainer>
  )
}
