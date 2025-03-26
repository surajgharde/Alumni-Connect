import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  SimpleGrid,
  Textarea,
  FormErrorMessage,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  Divider,
  Text,
  useColorModeValue,
  Avatar
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DatabaseService, UserProfile, Experience } from '../services/DatabaseService';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const [experienceFields, setExperienceFields] = useState<Experience[]>([
    { company: '', position: '', duration: '', description: '' }
  ]);
  
  // Form state
  const [formData, setFormData] = useState<Omit<UserProfile, 'id'>>({
    name: '',
    graduationYear: 0,
    program: '',
    company: '',
    position: '',
    location: '',
    image: '',
    email: '',
    bio: '',
    skills: [],
    education: '',
    linkedin: '',
    twitter: '',
    website: '',
    experiences: []
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load existing profile data if available
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await DatabaseService.getCurrentUserProfile();
        
        if (userProfile) {
          setFormData({
            name: userProfile.name || '',
            graduationYear: userProfile.graduationYear || 0,
            program: userProfile.program || '',
            company: userProfile.company || '',
            position: userProfile.position || '',
            location: userProfile.location || '',
            image: userProfile.image || '',
            email: userProfile.email || '',
            bio: userProfile.bio || '',
            skills: userProfile.skills || [],
            education: userProfile.education || '',
            linkedin: userProfile.linkedin || '',
            twitter: userProfile.twitter || '',
            website: userProfile.website || '',
            experiences: userProfile.experiences || []
          });
          
          if (userProfile.experiences && userProfile.experiences.length > 0) {
            setExperienceFields(userProfile.experiences);
          }
        } else if (user) {
          // Initialize with basic user data if no profile exists yet
          setFormData(prev => ({
            ...prev,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            graduationYear: parseInt(user.graduationYear) || new Date().getFullYear(),
            education: `Graduated in ${user.graduationYear}`
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    
    loadUserProfile();
  }, [isAuthenticated, navigate, user, toast]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'graduationYear' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle skill input
  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  
  // Handle experience fields
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = [...experienceFields];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    setExperienceFields(updatedExperiences);
  };
  
  const handleAddExperience = () => {
    setExperienceFields([
      ...experienceFields,
      { company: '', position: '', duration: '', description: '' }
    ]);
  };
  
  const handleRemoveExperience = (index: number) => {
    if (experienceFields.length > 1) {
      setExperienceFields(experienceFields.filter((_, i) => i !== index));
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.graduationYear) {
      newErrors.graduationYear = "Graduation year is required";
    } else if (formData.graduationYear < 1900 || formData.graduationYear > new Date().getFullYear() + 10) {
      newErrors.graduationYear = "Please enter a valid graduation year";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create profile data with experiences
      const profileData: UserProfile = {
        ...formData,
        id: user?.id || 0,
        experiences: experienceFields.filter(exp => exp.company.trim() && exp.position.trim())
      };
      
      // Save to database service
      await DatabaseService.updateUserProfile(profileData);
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Redirect to profile page
      navigate('/profile/me');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was a problem saving your profile data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Container maxW="container.md" py={8}>
      <Box 
        p={8} 
        bg={bg}
        boxShadow="md"
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading as="h1" size="xl" mb={6}>
          Edit Profile
        </Heading>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="flex-start">
            <HStack w="full" spacing={6} align="flex-start">
              <Box textAlign="center">
                <Avatar 
                  size="xl" 
                  src={formData.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  mb={2}
                />
                <FormControl>
                  <FormLabel>Profile Image URL</FormLabel>
                  <Input 
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </FormControl>
              </Box>
              
              <VStack flex="1" spacing={4} align="flex-start">
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel>Full Name</FormLabel>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
              </VStack>
            </HStack>
            
            <SimpleGrid columns={2} spacing={6} w="full">
              <FormControl isRequired isInvalid={!!errors.graduationYear}>
                <FormLabel>Graduation Year</FormLabel>
                <Input 
                  name="graduationYear"
                  type="number"
                  value={formData.graduationYear || ''}
                  onChange={handleChange}
                  placeholder="2023"
                />
                <FormErrorMessage>{errors.graduationYear}</FormErrorMessage>
              </FormControl>
              
              <FormControl>
                <FormLabel>Program</FormLabel>
                <Input 
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Company</FormLabel>
                <Input 
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your current company"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Position</FormLabel>
                <Input 
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Your job title"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Education</FormLabel>
                <Input 
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Your education history"
                />
              </FormControl>
            </SimpleGrid>
            
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Skills</FormLabel>
              <HStack>
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button onClick={handleAddSkill}>Add</Button>
              </HStack>
              
              <Box mt={2}>
                <HStack spacing={2} flexWrap="wrap">
                  {formData.skills.map((skill, index) => (
                    <Tag
                      size="md"
                      key={index}
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue"
                      my={1}
                    >
                      <TagLabel>{skill}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveSkill(skill)} />
                    </Tag>
                  ))}
                </HStack>
              </Box>
            </FormControl>
            
            <Divider />
            
            <Box w="full">
              <Heading as="h3" size="md" mb={4}>
                Social Links
              </Heading>
              
              <SimpleGrid columns={1} spacing={4} w="full">
                <FormControl>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <Input 
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Twitter URL</FormLabel>
                  <Input 
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/yourusername"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Personal Website</FormLabel>
                  <Input 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>
            
            <Divider />
            
            <Box w="full">
              <Heading as="h3" size="md" mb={4}>
                Experience
              </Heading>
              
              {experienceFields.map((exp, index) => (
                <Box 
                  key={index} 
                  p={4}
                  mb={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={borderColor}
                >
                  <HStack justify="space-between" mb={4}>
                    <Text fontWeight="bold">Experience #{index + 1}</Text>
                    <Button 
                      size="sm" 
                      colorScheme="red" 
                      onClick={() => handleRemoveExperience(index)}
                      isDisabled={experienceFields.length === 1}
                    >
                      Remove
                    </Button>
                  </HStack>
                  
                  <SimpleGrid columns={2} spacing={4} w="full">
                    <FormControl>
                      <FormLabel>Company</FormLabel>
                      <Input 
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Position</FormLabel>
                      <Input 
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                        placeholder="Your job title"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Duration</FormLabel>
                      <Input 
                        value={exp.duration}
                        onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                        placeholder="e.g. Jan 2022 - Present"
                      />
                    </FormControl>
                    
                    <FormControl gridColumn="span 2">
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        placeholder="Describe your role and achievements"
                        rows={2}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>
              ))}
              
              <Button 
                onClick={handleAddExperience} 
                colorScheme="blue" 
                variant="outline"
                leftIcon={<span>+</span>}
              >
                Add Experience
              </Button>
            </Box>
            
            <HStack w="full" justify="space-between" pt={4}>
              <Button onClick={() => navigate('/profile/me')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                colorScheme="blue" 
                isLoading={isLoading}
              >
                Save Profile
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Container>
  );
} 