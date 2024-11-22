'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Canvas, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface BloodSupply {
  type: string
  percentage: number
  color: string
}

const dummyBloodData: BloodSupply[] = [
  { type: 'A+', percentage: 54, color: '#4A1515' },
  { type: 'B+', percentage: 18, color: '#D88E8E' },
  { type: 'AB+', percentage: 28, color: '#2D0C0C' }
]

const PieChart3D: React.FC<{ data: BloodSupply[] }> = ({ data }) => {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useEffect(() => {
    if (camera) {
      // Set camera position for the tilted view
      camera.position.set(-2, 2, 4)
      camera.lookAt(0, 0, 0)
    }
  }, [camera])

  const totalValue = data.reduce((sum, item) => sum + item.percentage, 0)
  let startAngle = 0

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      {data.map((item, index) => {
        const angle = (item.percentage / totalValue) * Math.PI * 2
        const endAngle = startAngle + angle
        const midAngle = startAngle + angle / 2

        // Calculate position for separated segments
        const separation = 0.1
        const offsetX = Math.cos(midAngle) * separation
        const offsetY = Math.sin(midAngle) * separation

        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.arc(0, 0, 2, startAngle, endAngle, false)
        shape.lineTo(0, 0)

        const extrudeSettings = {
          depth: 0.5,
          bevelEnabled: true,
          bevelSegments: 4,
          steps: 1,
          bevelSize: 0.05,
          bevelThickness: 0.05
        }

        // Calculate label position
        const labelRadius = 1.2
        const labelX = Math.cos(midAngle) * labelRadius + offsetX
        const labelY = Math.sin(midAngle) * labelRadius + offsetY
        const labelZ = 0.3

        startAngle = endAngle

        return (
          <group key={index} position={[offsetX, offsetY, 0]}>
            <mesh>
              <extrudeGeometry args={[shape, extrudeSettings]} />
              <meshStandardMaterial 
                color={item.color} 
                roughness={0.5}
                metalness={0.2}
              />
            </mesh>
            <Text
              position={[labelX, labelY, labelZ]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
              rotation={[-Math.PI / 4, 0, 0]}
            >
              {`${item.percentage}%`}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

const BloodSupplyPage: React.FC = () => {
  const [bloodData, setBloodData] = useState<BloodSupply[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBloodSupply = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBloodData(dummyBloodData)
      setIsLoading(false)
    }

    fetchBloodSupply()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8EFEF] p-8">
        <div className="text-center text-[#4A1515]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#F8EFEF]">
      <div className="max-w-5xl p-8 mx-auto">
        <h1 className="text-3xl font-bold text-[#4A1515] mb-8">
          Blood Supply Levels
        </h1>

        <div className="grid items-center gap-8 mb-12 md:grid-cols-2">
          {/* 3D Pie Chart */}
          <div className="h-[400px] w-full">
            <Canvas>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={0.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.3} />
              <PieChart3D data={bloodData} />
            </Canvas>
          </div>

          {/* Progress Bars */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#4A1515] mb-4">
              December 2024
            </h2>
            {bloodData.map((blood) => (
              <div key={blood.type} className="space-y-2">
                <div className="flex justify-between text-[#4A1515]">
                  <span>{blood.type}</span>
                  <span>{blood.percentage}%</span>
                </div>
                <div className="h-8 overflow-hidden rounded-full bg-white/50">
                  <div
                    className="h-full transition-all duration-1000 rounded-full"
                    style={{
                      width: `${blood.percentage}%`,
                      backgroundColor: blood.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="relative bottom-8 left-8">
          <a
            href="/admin"
            className="flex items-center text-[#4A1515] hover:opacity-80"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span>Back to Admin</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default BloodSupplyPage

