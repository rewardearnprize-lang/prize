import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Clock, CheckCircle, Zap, AlertCircle } from "lucide-react";

interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransparencyModal = ({ isOpen, onClose }: TransparencyModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 border border-blue-500/30">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              <Shield className="w-16 h-16 text-blue-400 mx-auto" />
              <h2 className="text-3xl font-bold text-white">How Does the Draw System Work?</h2>
              <p className="text-lg text-gray-300">Full transparency in the winner selection process</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Draw Mechanism */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                Winner Selection Mechanism
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <p className="font-medium text-white">Automatic Random Draw</p>
                    <p className="text-sm">Winners are selected using Firebase’s random algorithm to ensure complete fairness</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <p className="font-medium text-white">Data Encryption</p>
                    <p className="text-sm">All data is protected and encrypted, and cannot be tampered with by any party</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <p className="font-medium text-white">Open Record</p>
                    <p className="text-sm">Any participant can review the participants list and verify the fairness of the draw</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timing */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-400" />
                When Does the Draw Take Place?
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2">Automatic Draw</h4>
                  <p className="text-gray-300 text-sm">Happens once the required number of participants for any prize is completed</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2">Scheduled Draw</h4>
                  <p className="text-gray-300 text-sm">Weekly draw every Friday at 3 PM (Saudi Time)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Qualification Requirements */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-green-400" />
                Eligibility Requirements
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-green-400">✅ Required Conditions</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Enter a valid email address</li>
                      <li>• Successfully complete the required offer</li>
                      <li>• Completion confirmation from OGAds</li>
                      <li>• No fake or duplicate accounts</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-red-400">❌ Disqualification Reasons</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Not completing the offer fully</li>
                      <li>• Using fake information</li>
                      <li>• Attempting to manipulate the system</li>
                      <li>• Registering multiple times with the same email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Process */}
          <Card className="bg-yellow-500/20 border-yellow-500/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2 text-yellow-400" />
                Verification & Announcement Process
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</span>
                  <p className="text-gray-300">The draw is executed automatically by the system</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</span>
                  <p className="text-gray-300">An instant notification is sent to the winner via email</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</span>
                  <p className="text-gray-300">The winner’s name is published on the Winners page within 24 hours</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">4</span>
                  <p className="text-gray-300">Prize delivery within 3-5 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-3"
            >
              Got it, I want to participate now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransparencyModal;
